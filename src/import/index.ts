import axios from 'axios';
import { getScheduleProps } from './utils';
import { validateFixtures } from './validate';
const server = require('../../../src/ui/server');
const API_BASE_URL = server.API_BASE_URL;

export const csvRows = (csv: string): string[][] => {
    const lines = csv.split('\n').filter(x => x.trim());
    const delim = lines[0].includes(',') ? ',' : ';';
    const rows = lines.slice(1).map(row => row.split(delim));
    return rows;
};

const fixMatchIds = (team: string, offset: number): string => {
    if (team && team.startsWith('~match')) {
        const match = team.match(/~match:(\d+)\/p:(\d+)/);
        if (match) {
            const fullMatchId = parseInt(match[1]) + offset;
            return `${match[2] === '1' ? 'WINNER' : 'LOSER'} of ${fullMatchId}`;
        }
        return 'TBD';
    }
    return team;
};

const concatIfTilda = (team: string, poolField: string, poolIdField: string, positionField: string, categoryField: string | null, fixture: any): string => {
    if (!team || !team.includes('~')) return team;
    const pGroup = `${fixture[poolField]}/${fixture[poolIdField]}`;
    const cat = categoryField ? fixture[categoryField] : fixture.category;
    return `${team}match:${pGroup}/p:${fixture[positionField]}/${cat}`;
};

export const generateFixturesImport = async (data: any): Promise<any> => {
    let activities = data.activities;

    if (!Array.isArray(activities)) {
        activities = Object.keys(activities)
            .sort((a, b) => parseInt(a) - parseInt(b))
            .map(key => activities[key]);
    }

    const dataRows = activities
        .filter((row: any) => row.matchId !== 'matchId')
        .filter((row: any) => !!row.matchId.trim());

    const { tournamentId, startDate, title, location, pinCode } = data;
    const tOffset = +tournamentId * 10000;
    const { pitches, categories, teams, groups } = getScheduleProps(dataRows);

    try {
        console.log('generateFixturesImport - Using API_BASE_URL:', API_BASE_URL);
        await axios.delete(`${API_BASE_URL}/tournaments/${tournamentId}/fixtures`);
        await axios.delete(`${API_BASE_URL}/tournaments/${tournamentId}/pitches`);
        await axios.delete(`${API_BASE_URL}/tournaments/${tournamentId}/cards`);

        const pitchData = pitches.map((p: string) => ({
            pitch: p,
            location: location.substring(0, 10),
            type: 'grass',
            tournamentId,
        }));
        await axios.post(`${API_BASE_URL}/tournaments/${tournamentId}/pitches`, pitchData);

        const fixtureData = dataRows.map((fixture: any) => {
            const { matchId, startTime, pitch, stage, category, group, team1, team2, umpireTeam } = fixture;
            const cOffset = categories.indexOf(category) * 1000;
            const offset = tOffset + cOffset;
            const fullMatchId = offset + parseInt(matchId);

            return {
                id: fullMatchId,
                tournamentId,
                category,
                groupNumber: parseInt(group),
                stage,
                pitch,
                scheduled: `${startDate.split('T')[0]}T${startTime}:00.000Z`,
                started: null,
                team1Planned: team1,
                team1Id: team1,
                goals1: null,
                points1: null,
                team2Planned: team2,
                team2Id: team2,
                goals2: null,
                points2: null,
                umpireTeamPlanned: umpireTeam,
                umpireTeamId: umpireTeam,
            };
        });

        await axios.post(`${API_BASE_URL}/tournaments/${tournamentId}/fixtures`, fixtureData);

        return { properties: { pitches, categories, teams, groups }, fixtures: dataRows };
    } catch (error) {
        console.error('Error importing fixtures:', error.message);
        throw error;
    }
};

export const importFixturesCsv = async (csv: string, tournamentId: string, startDate: string, title: string, location: string, pinCode: string) => {
    const rows = csvRows(csv);
    const dataRows = wrapRows(rows
        .filter((row: any) => row[0] !== 'matchId')
        .filter((row: any) => !!(row[0]).trim())
    );
    const { pitches, categories, teams, groups } = getScheduleProps(dataRows);
    const tOffset = +tournamentId * 10000;

    const insertPitch = (p: string) => {
        return `\nINSERT INTO \`EuroTourno\`.\`pitches\` (pitch, location, type, tournamentId) VALUES ('${p}', '${location.substring(0, 10)}', 'grass', ${tournamentId});`;
    };
    const p = pitches.map((p: any) => insertPitch(p));

    const rowsOut = [
        `DELETE FROM \`EuroTourno\`.\`fixtures\` WHERE \`tournamentId\` = ${tournamentId};`,
        `DELETE FROM \`EuroTourno\`.\`pitches\` WHERE \`tournamentId\` = ${tournamentId};`,
        `DELETE FROM \`EuroTourno\`.\`tournaments\` WHERE \`id\` = ${tournamentId};`,
        `DELETE FROM \`EuroTourno\`.\`cards\` WHERE \`tournament\` = ${tournamentId};`,
        `\nINSERT INTO \`EuroTourno\`.\`tournaments\` (id, Date, Title, Location, Lat, Lon, code) VALUES (${tournamentId}, '${startDate}', '${title}', '${location}', '52.2942', '4.842', '${pinCode}');`,
        ...p,
    ];

    dataRows.forEach((fixture: any) => {
        const { matchId, time, pitch, stage, category, group, team1, team2, umpireTeam } = fixture;
        const cOffset = categories.indexOf(category) * 1000;
        const offset = tOffset + cOffset;
        const useTeam1 = fixMatchIds(concatIfTilda(team1, 'pool1', 'pool1Id', 'position1', null, fixture), offset);
        const useTeam2 = fixMatchIds(concatIfTilda(team2, 'pool2', 'pool2Id', 'position2', null, fixture), offset);
        const useUmpireTeam = fixMatchIds(concatIfTilda(umpireTeam, 'poolUmp', 'poolUmpId', 'positionUmp', 'categoryUmp', fixture), offset);
        fixture.team1 = useTeam1;
        fixture.team2 = useTeam2;
        fixture.umpireTeam = useUmpireTeam;
        fixture.matchId = offset + parseInt(matchId);
        fixture.group = +fixture.group;
        fixture.duration = +fixture.duration;

        const sql = `\nINSERT INTO \`EuroTourno\`.\`fixtures\` (id, tournamentId, category, groupNumber, stage, pitch, scheduled, started, team1Planned, team1Id, goals1, points1, team2Planned, team2Id, goals2, points2, umpireTeamPlanned, umpireTeamId) VALUES (${fixture.matchId}, ${tournamentId}, '${category}', ${fixture.group}, '${stage}', '${pitch}', '${startDate} ${time}:00', NULL, '${useTeam1}', '${useTeam1}', NULL, NULL, '${useTeam2}', '${useTeam2}', NULL, NULL, '${useUmpireTeam}', '${useUmpireTeam}');`;
        rowsOut.push(sql);
    });

    return { properties: { pitches, categories, teams, groups }, fixtures: dataRows, sql: rowsOut.join('\n') };
};
