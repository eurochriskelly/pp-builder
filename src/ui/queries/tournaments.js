const { apiRequest } = require('../api');

async function getAllMatches(tournamentId) {
    const data = await apiRequest('get', `/tournaments/${tournamentId}/all-matches`);
    return data.map(fixture => ({
        id: fixture.id,
        category: fixture.category || 'N/A',
        grp: fixture.g || 'N/A',
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
    const data = await apiRequest('get', `/tournaments/${tournamentId}/group-standings`);
    const byCategory = {};
    for (const [category, groups] of Object.entries(data)) {
        byCategory[category] = [];
        for (const [groupName, standings] of Object.entries(groups)) {
            const rows = standings.map(row => ({
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
    const data = await apiRequest('get', `/tournaments/${tournamentId}/finals-results`);
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
    }));
}

async function createTournament(tournamentData) {
    const response = await apiRequest('post', '/tournaments', tournamentData);
    return response; 
}

async function getTournamentByUuid(uuid) {
    const tournament = await apiRequest('get', `/tournaments/by-uuid/${uuid}`);
    return tournament;
}

module.exports = { getAllMatches, getGroupStandings, getFinalsResults, createTournament, getTournamentByUuid };
