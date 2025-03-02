const express = require('express');
const { getRecentMatches, getGroupFixtures, getGroupStandings, getKnockoutFixtures } = require('../../queries/matches');
const generateHeader = require('../../templates/header');
const generateFooter = require('../../templates/footer');
const generateRecentView = require('../../templates/views/execution/recent');
const generateGroupFixtures = require('../../templates/views/execution/groupFixtures');
const generateGroupStandings = require('../../templates/views/execution/groupStandings');
const generateKnockoutFixtures = require('../../templates/views/execution/knockoutFixtures');

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
        console.log(`Group standings categories: ${Object.keys(data).length}`);
        const content = generateGroupStandings(data);
        const isLoggedIn = !!req.session.user;
        const html = `${generateHeader('Group Standings', tournamentId, 'execution', 'view3', isLoggedIn, isLoggedIn)}<div id="content" hx-get="/execution/${tournamentId}/view3-update" hx-trigger="every 30s" hx-swap="innerHTML">${content}</div>${generateFooter()}`;
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
        console.log(`Knockout fixtures: ${data.length} items`);
        const content = generateKnockoutFixtures(data);
        const isLoggedIn = !!req.session.user;
        const html = `${generateHeader('Knockout Fixtures', tournamentId, 'execution', 'view4', isLoggedIn, isLoggedIn)}<div id="content" hx-get="/execution/${tournamentId}/view4-update" hx-trigger="every 30s" hx-swap="innerHTML">${content}</div>${generateFooter()}`;
        res.send(html);
    } catch (error) {
        console.error('Error in /execution/:id/view4:', error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

