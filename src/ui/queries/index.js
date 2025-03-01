const { loginUser } = require('./auth');
const { getAllMatches, getGroupStandings, getFinalsResults, createTournament, getTournamentByUuid } = require('./tournaments');
const { getRecentMatches, getGroupFixtures, getKnockoutFixtures, getMatchesByPitch } = require('./matches');
const { getCardedPlayers } = require('./players');

module.exports = {
    loginUser,
    getAllMatches,
    getGroupStandings,
    getFinalsResults,
    createTournament,
    getTournamentByUuid,
    getRecentMatches,
    getGroupFixtures,
    getKnockoutFixtures,
    getMatchesByPitch,
    getCardedPlayers
};
