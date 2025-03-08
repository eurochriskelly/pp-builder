const generateRecentView = require('../templates/views/execution/recent');
const generateGroupFixtures = require('../templates/views/execution/groupFixtures');
const generateGroupStandings = require('../templates/views/execution/groupStandings');
const generateKnockoutFixtures = require('../templates/views/execution/knockoutFixtures');
const generateCardedPlayers = require('../templates/views/execution/cardedPlayers');
const generateMatchesByPitch = require('../templates/views/execution/matchesByPitch');
const generateFinalsResults = require('../templates/views/execution/finalsResults');

const { 
    getRecentMatches, 
    getGroupFixtures, 
    getGroupStandings,
    getKnockoutFixtures,
    getCardedPlayers,
    getMatchesByPitch,
    getFinalsResults
} = require('../queries/matches');

const allowedViews = {
    'recent': {
        title: 'Recent Matches',
        generator: generateRecentView,
        fetch: getRecentMatches
    },
    'view2': {
        title: 'Group Fixtures',
        generator: generateGroupFixtures,
        fetch: getGroupFixtures
    },
    'view3': {
        title: 'Group Standings',
        generator: generateGroupStandings,
        fetch: getGroupStandings
    },
    'view4': {
        title: 'Knockout Fixtures',
        generator: generateKnockoutFixtures,
        fetch: getKnockoutFixtures
    },
    'view6': {
        title: 'Matches by Pitch',
        generator: generateMatchesByPitch,
        fetch: getMatchesByPitch
    },
    'view7': {
        title: 'Finals Results',
        generator: generateFinalsResults,
        fetch: getFinalsResults
    }
};

module.exports = { allowedViews }
