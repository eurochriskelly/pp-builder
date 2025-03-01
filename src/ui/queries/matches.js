const { apiRequest } = require('../api');

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

module.exports = { getRecentMatches, getGroupFixtures, getKnockoutFixtures, getMatchesByPitch };
