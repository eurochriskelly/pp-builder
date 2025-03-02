const generateRecentView = require('../templates/views/execution/recent');
const generateGroupFixtures = require('../templates/views/execution/groupFixtures');
const generateKnockoutFixtures = require('../templates/views/execution/knockoutFixtures');
const { getRecentMatches, getGroupFixtures, getKnockoutFixtures } = require('../queries');

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
    'view4': {
        title: 'Knockout Fixtures',
        generator: generateKnockoutFixtures,
        fetch: getKnockoutFixtures
    }
};

module.exports = { allowedViews }
