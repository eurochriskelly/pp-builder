const { apiRequest } = require('../../../src/ui/api');

async function getSchedule(id, category) {
    try {
        const data = await apiRequest('get', `/tournaments/${id}/fixtures/nextup`);
        return category ? data.data.filter(x => x.category === category) : data.data;
    } catch (error) {
        console.error('Error fetching schedule:', error.message);
        return [];
    }
}

async function playMatch(fixture, score, category) {
    const generateTeamData = (name1, name2) => {
        const getRandomInt = max => Math.floor(Math.random() * max);
        const safeName1 = name1 && typeof name1 === 'string' ? name1 : 'Team1';
        const safeName2 = name2 && typeof name2 === 'string' ? name2 : 'Team2';
        return {
            scores: {
              team1: { name: safeName1, goals: getRandomInt(6), points: getRandomInt(23) },
              team2: { name: safeName2, goals: getRandomInt(6), points: getRandomInt(23) },
            },
            outcome: 'played'
        };
    };
    const { tournamentId, matchId, team1, team2 } = fixture || {};
    if (!tournamentId || !matchId) {
        console.error('Invalid fixture:', fixture);
        return;
    }
    try {
        const res = await apiRequest('post', `/tournaments/${tournamentId}/fixtures/${matchId}/start?category=${category}`);
        const data = generateTeamData(team1, team2);
        await apiRequest('post', `/tournaments/${tournamentId}/fixtures/${matchId}/score`, data);
        await apiRequest('post', `/tournaments/${tournamentId}/fixtures/${matchId}/end?category=${category}`, data);
    } catch (error) {
        console.error('Error playing match:', error.message);
    }
}

async function getFixtures(id) {
    return await apiRequest('get', `/tournaments/${id}/fixtures`);
}

async function getTournaments() {
    try {
        const data = await apiRequest('get', '/tournaments');
        return data.data; 
    } catch (error) {
        console.error('Error fetching tournaments:', error.message);
        return [];
    }
}

module.exports = { getSchedule, playMatch, getFixtures, getTournaments };
