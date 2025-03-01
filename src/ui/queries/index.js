const { loginUser } = require('./auth');
const { getAllMatches, getGroupStandings, getFinalsResults } = require('./tournaments');
const { getRecentMatches, getGroupFixtures, getKnockoutFixtures, getMatchesByPitch } = require('./matches');
const { getCardedPlayers } = require('./players');

module.exports = {
    loginUser,
    getAllMatches,
    getGroupStandings,
    getFinalsResults,
    getRecentMatches,
    getGroupFixtures,
    getKnockoutFixtures,
    getMatchesByPitch,
    getCardedPlayers
};
