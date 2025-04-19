const express = require('express');
const { 
    getCardedPlayers, 
    getRecentMatches, 
    getGroupFixtures, 
    getGroupStandings, 
    getKnockoutFixtures,
    getMatchesByPitch,
    getFinalsResults 
} = require('../../queries/matches');
const generateHeader = require('../../templates/header');
const generateFooter = require('../../templates/footer');
const generateRecentView = require('../../templates/views/execution/recent');
const generateGroupFixtures = require('../../templates/views/execution/competitionView/partials/groupFixtures');
const generateGroupStandings = require('../../templates/views/execution/competitionView/partials/groupStandings');
const generateKnockoutFixtures = require('../../templates/views/execution/competitionView/partials/knockoutFixtures');
const generateEditFixtureForm = require('../../templates/views/execution/competitionView/partials/editFixture');
const generateCardedPlayers = require('../../templates/views/execution/competitionView/partials/cardedPlayers');
const generateFinalsResults = require('../../templates/views/execution/competitionView/partials/finalsResults');
const generateMatchesByPitch = require('../../templates/views/execution/matchesByPitch');

const router = express.Router();

router.get('/execution/:id/recent', async (req, res) => {
    const tournamentId = parseInt(req.params.id, 10);
    try {
        console.log(`Fetching recent matches for tournament ${tournamentId}...`);
        const isLoggedIn = !!req.session.user;
        const { count, matches } = await getRecentMatches(tournamentId);
        console.log(`Recent matches: ${matches.length} items, total count: ${count}`);
        const content = generateRecentView(matches, count);
        const html = `${generateHeader('Tournament Status', tournamentId, 'execution', 'recent', isLoggedIn, isLoggedIn)}<div id="content" hx-get="/execution/${tournamentId}/recent-update" hx-trigger="every 30s" hx-swap="innerHTML">${content}</div>${generateFooter()}`;
        res.send(html);
    } catch (error) {
        console.log(error)
        console.error('Error in /execution/:id/recent:', error.message);
        res.status(500).send('Server Error');
    }
});

router.get('/execution/:id/view2', async (req, res) => {
    const tournamentId = parseInt(req.params.id, 10);
    try {
        console.log(`Fetching group fixtures for tournament ${tournamentId}...`);
        const data = await getGroupFixtures(tournamentId);
        console.log(`Group fixtures: ${data.length} items`);
        const content = generateGroupFixtures(data);
        const isLoggedIn = !!req.session.user;
        const html = `${generateHeader('Group Fixtures', tournamentId, 'execution', 'view2', isLoggedIn, isLoggedIn)}<div id="content" hx-get="/execution/${tournamentId}/view2-update" hx-trigger="every 30s" hx-swap="innerHTML">${content}</div>${generateFooter()}`;
        res.send(html);
    } catch (error) {
        console.error('Error in /execution/:id/view2:', error.message);
        res.status(500).send('Server Error');
    }
});

router.get('/execution/:id/view3', async (req, res) => {
    const tournamentId = parseInt(req.params.id, 10);
    try {
        console.log(`Fetching group standings for tournament ${tournamentId}...`);
        const data = await getGroupStandings(tournamentId);
        const groupFixtures = await getGroupFixtures(tournamentId);
        console.log(`Group standings categories: ${Object.keys(data).length}`);
        const content = generateGroupStandings(data, groupFixtures);
        const isLoggedIn = !!req.session.user;
        const html = `${generateHeader('Group Tables', tournamentId, 'execution', 'view3', isLoggedIn, isLoggedIn)}<div id="content" hx-get="/execution/${tournamentId}/view3-update" hx-trigger="every 30s" hx-swap="innerHTML">${content}</div>${generateFooter()}`;
        res.send(html);
    } catch (error) {
        console.error('Error in /execution/:id/view3:', error.message);
        res.status(500).send('Server Error');
    }
});

router.get('/execution/:id/view4', async (req, res) => {
    const tournamentId = parseInt(req.params.id, 10);
    try {
        console.log(`Fetching knockout fixtures for tournament ${tournamentId}...`);
        const data = await getKnockoutFixtures(tournamentId);
        console.log('TTTTT', tournamentId)
        const content = generateKnockoutFixtures(data, true, tournamentId);
        const isLoggedIn = !!req.session.user;
        const html = `${generateHeader('Knockout Fixtures', tournamentId, 'execution', 'view4', isLoggedIn, isLoggedIn)}<div id="content" hx-get="/execution/${tournamentId}/view4-update" hx-trigger="every 30s" hx-swap="innerHTML">${content}</div>${generateFooter()}`;
        res.send(html);
    } catch (error) {
        console.error('Error in /execution/:id/view4:', error.message);
        res.status(500).send('Server Error');
    }
});

router.get('/execution/:id/view5', async (req, res) => {
    const tournamentId = parseInt(req.params.id, 10);
    try {
        console.log(`Fetching carded players for tournament ${tournamentId}...`);
        const data = await getCardedPlayers(tournamentId);
        console.log(`Carded players: ${data.length} items`);
        const content = generateCardedPlayers(data);
        const html = `${generateHeader('Carded Players', tournamentId, 'execution', 'view5')}<div id="content" hx-get="/execution/${tournamentId}/view5-update" hx-trigger="every 30s" hx-swap="innerHTML">${content}</div>${generateFooter()}`;
        res.send(html);
    } catch (error) {
        console.error('Error in /execution/:id/view5:', error.message);
        res.status(500).send('Server Error');
    }
});

router.get('/execution/:id/view6', async (req, res) => {
    const tournamentId = parseInt(req.params.id, 10);
    try {
        console.log(`Fetching matches by pitch for tournament ${tournamentId}...`);
        const data = await getMatchesByPitch(tournamentId);
        console.log(`Matches by pitch: ${data.length} items`);
        const content = generateMatchesByPitch(data);
        const html = `${generateHeader('Matches by Pitch', tournamentId, 'execution', 'view6')}<div id="content" hx-get="/execution/${tournamentId}/view6-update" hx-trigger="every 30s" hx-swap="innerHTML">${content}</div>${generateFooter()}`;
        res.send(html);
    } catch (error) {
        console.error('Error in /execution/:id/view6:', error.message);
        res.status(500).send('Server Error');
    }
});

router.get('/execution/:id/view7', async (req, res) => {
    const tournamentId = parseInt(req.params.id, 10);
    try {
        console.log(`Fetching finals results for tournament ${tournamentId}...`);
        const data = await getFinalsResults(tournamentId);
        console.log(`Finals results: ${data.length} items`);
        const content = generateFinalsResults(data);
        const html = `${generateHeader('Finals', tournamentId, 'execution', 'view7')}<div id="content" hx-get="/execution/${tournamentId}/view7-update" hx-trigger="every 30s" hx-swap="innerHTML">${content}</div>${generateFooter()}`;
        res.send(html);
    } catch (error) {
        console.error('Error in /execution/:id/view7:', error.message);
        res.status(500).send('Server Error');
    }
});

// New edit‐fragment route
router.get('/execution/:tournamentId/fixture/:matchId/edit', async (req, res) => {
    const { tournamentId, matchId } = req.params;
    console.log('We are here', tournamentId, matchId);
    // fetch or compute whatever edit‐form markup you need; minimal example:
    //const data = await getFixture(tournamentId, matchId);
    res.send(generateEditFixtureForm(
        {
            id: '',
            team1: 'xx',
            team2: 'yy',
            goals1: 0,
            points1: 0,
            goals2: 0,
            points2: 0,
            pitch: '',
            time: ''
        }
    ));
});

module.exports = router;

