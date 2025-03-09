const { apiRequest } = require('../api');

// Fetch group standings
async function getGroupStandings(tournamentId) {
    const data = await apiRequest('get', `/tournaments/${tournamentId}/group-standings`);
    // Transform nested object into the expected grouped format
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

async function getRecentMatches(tournamentId) {
    const data = await apiRequest('get', `/tournaments/${tournamentId}/recent-matches`);
    const matches = data.matches.map(match => ({
        id: match.id,
        start: match.start || 'N/A',
        pitch: match.pitch || 'N/A',
        grp: match.grp || 'N/A',
        stage: match.stage || 'N/A',
        competition: match.competition || 'N/A',
        team1: match.team1 || 'N/A',
        score1: match.score1 || 'N/A',
        team2: match.team2 || 'N/A',
        score2: match.score2 || 'N/A',
        umpireTeam: match.umpireTeam || 'N/A',
    }));
    return {
        count: data.matchCount,
        matches,
    };
}

async function getGroupFixtures(tournamentId) {
    const data = await apiRequest('get', `/tournaments/${tournamentId}/group-fixtures`);
    return data.map(fixture => ({
        id: fixture.id,
        category: fixture.category || 'N/A',
        g: fixture.g || 'N/A',
        pitch: fixture.pitch || 'N/A',
        scheduledTime: fixture.scheduledTime || 'N/A',
        team1: fixture.team1 || 'N/A',
        goals1: fixture.goals1,
        points1: fixture.points1,
        team2: fixture.team2 || 'N/A',
        goals2: fixture.goals2,
        points2: fixture.points2,
        umpireTeam: fixture.umpireTeam || 'N/A',
        outcome: fixture.outcome,
        started: fixture.started || 'false',
    }));
}

async function getKnockoutFixtures(tournamentId) {
    const data = await apiRequest('get', `/tournaments/${tournamentId}/knockout-fixtures`);
    return data.map(fixture => ({
        id: fixture.id,
        category: fixture.category || 'N/A',
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
        outcome: fixture.outcome,
        started: fixture.started || 'false',
    }));
}

async function getMatchesByPitch(tournamentId) {
    const data = await apiRequest('get', `/tournaments/${tournamentId}/matches-by-pitch`);
    return data.map(fixture => ({
        id: fixture.id,
        pitch: fixture.pitch || 'N/A',
        stage: fixture.stage || 'N/A',
        scheduledTime: fixture.scheduledTime || 'N/A',
        category: fixture.category || 'N/A',
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

async function getCardedPlayers(tournamentId) {
    const data = await apiRequest('get', `/tournaments/${tournamentId}/carded-players`);
    return data.map(player => ({
        playerNumber: player.playerId || 'N/A', // Assuming playerId is the number
        playerName: `${player.firstName || ''} ${player.secondName || ''}`.trim() || 'N/A',
        team: player.team || 'N/A',
        cardColor: player.cardColor || 'N/A',
    }));
}

// Fetch finals results
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
        outcome: result.outcome || 'played',
    }));
}

module.exports = { 
    getRecentMatches, 
    getGroupFixtures, 
    getKnockoutFixtures, 
    getMatchesByPitch,
    getCardedPlayers,
    getFinalsResults,
    getGroupStandings,
};
