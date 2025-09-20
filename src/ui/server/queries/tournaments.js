const { apiRequest } = require('../../api');

const unwrapApiData = payload => {
    let current = payload;
    while (current && typeof current === 'object' && Object.prototype.hasOwnProperty.call(current, 'data')) {
        current = current.data;
    }
    return current;
};

async function getAllMatches(tournamentId) {
    const response = await apiRequest('get', `/tournaments/${tournamentId}/all-matches`);
    const data = unwrapApiData(response) || [];
    return data.map(fixture => ({
        id: fixture.id,
        category: fixture.category || 'N/A',
        grp: fixture.grp || 'N/A',
        stage: fixture.stage || 'N/A',
        pitch: fixture.pitch || 'N/A',
        scheduledTime: fixture.scheduledTime || 'N/A',
        team1: fixture.team1 || 'N/A',
        goals1: fixture.goals1,
        points1: fixture.points1,
        team2: fixture.team2 || 'N/A',
        goals2: fixture.goals2,
        points2: fixture.points2,
        umpireTeam: fixture.umpireTeam || 'N/A',
        started: fixture.started || 'false',
    }));
}

async function getGroupStandings(tournamentId) {
    const response = await apiRequest('get', `/tournaments/${tournamentId}/group-standings`);
    const data = unwrapApiData(response) || {};
    const byCategory = {};
    const normalizeStandings = standings => {
        if (Array.isArray(standings)) {
            return standings;
        }
        if (standings && typeof standings === 'object') {
            return Object.keys(standings)
                .sort((a, b) => {
                    const aNum = Number(a);
                    const bNum = Number(b);
                    const aIsNum = !Number.isNaN(aNum);
                    const bIsNum = !Number.isNaN(bNum);
                    if (aIsNum && bIsNum) {
                        return aNum - bNum;
                    }
                    if (aIsNum) return -1;
                    if (bIsNum) return 1;
                    return a.localeCompare(b);
                })
                .reduce((acc, key) => {
                    const value = standings[key];
                    if (Array.isArray(value)) {
                        acc.push(...value);
                    } else if (value && typeof value === 'object') {
                        acc.push(value);
                    }
                    return acc;
                }, []);
        }
        return [];
    };

    for (const [category, groups] of Object.entries(data)) {
        byCategory[category] = [];
        for (const [groupName, standings] of Object.entries(groups)) {
            const normalizedRows = normalizeStandings(standings);
            const rows = normalizedRows.map(row => ({
                team: row.team || 'N/A',
                MatchesPlayed: row.MatchesPlayed || '0',
                Wins: row.Wins || '0',
                Draws: row.Draws || '0',
                Losses: row.Losses || '0',
                PointsFrom: row.PointsFrom || '0',
                PointsDifference: row.PointsDifference || '0',
                TotalPoints: row.TotalPoints || '0',
            }));
            byCategory[category].push({ groupName, rows });
        }
    }
    return byCategory;
}

async function getFinalsResults(tournamentId) {
    const response = await apiRequest('get', `/tournaments/${tournamentId}/finals-results`);
    const data = unwrapApiData(response) || [];
    return data.map(result => ({
        category: result.category || 'N/A',
        division: result.division || 'N/A',
        team1: result.team1 || 'N/A',
        goals1: result.goals1,
        points1: result.points1,
        team2: result.team2 || 'N/A',
        goals2: result.goals2,
        points2: result.points2,
        winner: result.winner || 'N/A',
        outcome: result.outcome || 'played',
    }));
}

async function createTournament(tournamentData) {
    const response = await apiRequest('post', '/tournaments', tournamentData);
    return unwrapApiData(response);
}

async function getTournamentByUuid(uuid) {
    const response = await apiRequest('get', `/tournaments/by-uuid/${uuid}`);
    return unwrapApiData(response);
}

module.exports = { getAllMatches, getGroupStandings, getFinalsResults, createTournament, getTournamentByUuid };
