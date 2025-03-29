const { apiRequest } = require('../api');

// Fetch group standings, optionally filtered by competition
async function getGroupStandings(tournamentId, competitionName = null) {
    const data = await apiRequest('get', `/tournaments/${tournamentId}/group-standings`);
    // Transform nested object into the expected grouped format
    let byCategory = {};
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

    // Filter by competition if provided
    if (competitionName && byCategory[competitionName]) {
        const filteredByCategory = {};
        filteredByCategory[competitionName] = byCategory[competitionName];
        byCategory = filteredByCategory; // Replace with filtered object
    } else if (competitionName) {
        byCategory = {}; // Return empty if competition requested but not found
    }

    return byCategory;
}

// Fetch recent matches, optionally filtered by competition
async function getRecentMatches(tournamentId, competitionName = null) {
    const data = await apiRequest('get', `/tournaments/${tournamentId}/recent-matches`);
    let matches = data.matches.map(match => ({
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

    // Filter by competition if provided
    if (competitionName) {
        matches = matches.filter(match => match.competition === competitionName);
    }

    // Note: The count remains the original total count from the API.
    // If the count should reflect the filtered matches, it needs adjustment.
    return {
        count: data.matchCount, 
        matches,
    };
}

// Fetch group fixtures, optionally filtered by competition
async function getGroupFixtures(tournamentId, competitionName = null) {
    let data = await apiRequest('get', `/tournaments/${tournamentId}/group-fixtures`);

    // Filter by competition if provided
    if (competitionName) {
        data = data.filter(fixture => fixture.category === competitionName);
    }

    return data.map(fixture => ({
        id: fixture.id,
        category: fixture.category || 'N/A', // Keep original category field
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

// Fetch knockout fixtures, optionally filtered by competition
async function getKnockoutFixtures(tournamentId, competitionName = null) {
    let data = await apiRequest('get', `/tournaments/${tournamentId}/knockout-fixtures`);

    // Filter by competition if provided
    if (competitionName) {
        data = data.filter(fixture => fixture.category === competitionName);
    }

    return data.map(fixture => ({
        id: fixture.id,
        category: fixture.category || 'N/A', // Keep original category field
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

// Fetch matches by pitch, optionally filtered by competition
async function getMatchesByPitch(tournamentId, competitionName = null) {
    let data = await apiRequest('get', `/tournaments/${tournamentId}/matches-by-pitch`);

    // Filter by competition if provided
    if (competitionName) {
        data = data.filter(fixture => fixture.category === competitionName);
    }

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

// Fetch carded players (Filtering by competition might not be applicable here based on data structure)
// Add competitionName parameter for consistency, but don't filter unless API supports it or data includes category
async function getCardedPlayers(tournamentId, competitionName = null) { 
    const data = await apiRequest('get', `/tournaments/${tournamentId}/carded-players`);
    
    // TODO: If the API response for carded players includes a category/competition field,
    // add filtering logic here similar to other functions.
    // if (competitionName) {
    //     data = data.filter(player => player.category === competitionName); // Example
    // }

    return data.map(player => ({
        playerNumber: player.playerId || 'N/A', // Assuming playerId is the number
        playerName: `${player.firstName || ''} ${player.secondName || ''}`.trim() || 'N/A',
        team: player.team || 'N/A',
        cardColor: player.cardColor || 'N/A',
    }));
}

// Fetch finals results, optionally filtered by competition
async function getFinalsResults(tournamentId, competitionName = null) {
    let data = await apiRequest('get', `/tournaments/${tournamentId}/finals-results`);

    // Filter by competition if provided
    if (competitionName) {
        data = data.filter(result => result.category === competitionName);
    }

    return data.map(result => ({
        category: result.category || 'N/A', // Keep original category field
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
