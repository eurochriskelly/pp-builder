const { apiRequest } = require('../../api');

const unwrapApiData = payload => {
    let current = payload;
    while (current && typeof current === 'object' && Object.prototype.hasOwnProperty.call(current, 'data')) {
        current = current.data;
    }
    return current;
};

// Fetch group standings, optionally filtered by competition
async function getGroupStandings(tournamentId, competitionName = null) {
    const response = await apiRequest('get', `/tournaments/${tournamentId}/group-standings`);
    const data = unwrapApiData(response) || {};
    // Transform nested object into the expected grouped format
    let byCategory = {};

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
    const response = await apiRequest('get', `/tournaments/${tournamentId}/recent-matches`);
    const data = unwrapApiData(response) || {};
    const matchesSource = Array.isArray(data.matches) ? data.matches : [];
    let matches = matchesSource.map(match => ({
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
    const response = await apiRequest('get', `/tournaments/${tournamentId}/group-fixtures`);
    let data = unwrapApiData(response) || [];
    // Filter by competition if provided
    if (competitionName) {
        data = data?.filter(fixture => fixture.category === competitionName);
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
    const response = await apiRequest('get', `/tournaments/${tournamentId}/knockout-fixtures`);
    let data = unwrapApiData(response) || [];

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
    const response = await apiRequest('get', `/tournaments/${tournamentId}/matches-by-pitch`);
    let data = unwrapApiData(response) || [];

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
    const response = await apiRequest('get', `/tournaments/${tournamentId}/carded-players`);
    const data = unwrapApiData(response) || [];
    
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
    const response = await apiRequest('get', `/tournaments/${tournamentId}/finals-results`);
    let data = unwrapApiData(response) || [];

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

async function getFixtureData(tournamentId, matchId) {
    const response = await apiRequest('get', `/tournaments/${tournamentId}/fixtures/${matchId}`);
    const data = unwrapApiData(response) || {};
    console.log('data is ', data);
    if (data && typeof data === 'object' && Object.keys(data).length) {
        return data;
    }
    return {
        id: data.id,
        category: data.category || 'N/A',
        stage: data.stage || 'N/A',
        pitch: data.pitch || 'N/A',
        scheduledTime: data.scheduledTime || 'N/A',
        team1: data.team1 || 'N/A',
        goals1: data.goals1,
        points1: data.points1,
        team2: data.team2 || 'N/A',
        goals2: data.goals2,
        points2: data.points2,
        umpireTeam: data.umpireTeam || 'N/A',
        outcome: data.outcome,
        started: data.started || 'false',
    };
}

async function getCategoryTeams(tournamentId, stage, category) {
    const response = await apiRequest('get', `/tournaments/${tournamentId}/fixtures/${matchId}`);
    const data = unwrapApiData(response) || {};
    if (data && typeof data === 'object' && Object.keys(data).length) {
        return data;
    }
    return {
        id: data.id,
        category: data.category || 'N/A',
        stage: data.stage || 'N/A',
        pitch: data.pitch || 'N/A',
        scheduledTime: data.scheduledTime || 'N/A',
        team1: data.team1 || 'N/A',
        goals1: data.goals1,
        points1: data.points1,
        team2: data.team2 || 'N/A',
        goals2: data.goals2,
        points2: data.points2,
        umpireTeam: data.umpireTeam || 'N/A',
        outcome: data.outcome,
        started: data.started || 'false',
    };
}
module.exports = { 
    getRecentMatches, 
    getGroupFixtures, 
    getKnockoutFixtures, 
    getMatchesByPitch,
    getCardedPlayers,
    getFinalsResults,
    getGroupStandings,
    getCompetitionData, // Add the new function here
    getFixtureData, 
    getCategoryTeams,
};

// New function to fetch all data for a specific competition
async function getCompetitionData(tournamentId, competitionName) {
    if (!competitionName) {
        throw new Error("Competition name is required to fetch competition data.");
    }
    try {
        // Fetch all data concurrently
        const [
            groupFixtures,
            groupStandings,
            knockoutFixtures,
            finalsResults
            // Add other data fetches here if needed (e.g., carded players filtered by competition if API supports it)
        ] = await Promise.all([
            getGroupFixtures(tournamentId, competitionName),
            getGroupStandings(tournamentId, competitionName),
            getKnockoutFixtures(tournamentId, competitionName),
            getFinalsResults(tournamentId, competitionName)
            // Example: getCardedPlayers(tournamentId, competitionName)
        ]);

        // Return the data in a structured object
        return {
            competitionName, // Include the name for context if needed
            groupFixtures,
            groupStandings, // This will be an object keyed by category, but should only contain the requested competition
            knockoutFixtures,
            finalsResults
            // cardedPlayers // If fetched
        };
    } catch (error) {
        console.error(`Error fetching comprehensive data for competition ${competitionName} in tournament ${tournamentId}:`, error.message);
        // Re-throw the error to be handled by the calling route
        throw error; 
    }
}
