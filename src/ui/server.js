const express = require('express');
const { processTeamName, formatScore } = require('./utils');
const {
    getRecentMatches,
    getGroupFixtures,
    getGroupStandings,
    getKnockoutFixtures,
    getCardedPlayers,
    getMatchesByPitch,
    getFinalsResults
} = require('./queries');
const generateHeader = require('./templates/header');
const generateFooter = require('./templates/footer');
const generateRecentView = require('./templates/views/recent');
const generateGroupFixtures = require('./templates/views/groupFixtures');
const generateGroupStandings = require('./templates/views/groupStandings');
const generateKnockoutFixtures = require('./templates/views/knockoutFixtures');
const generateCardedPlayers = require('./templates/views/cardedPlayers');
const generateMatchesByPitch = require('./templates/views/matchesByPitch');
const generateFinalsResults = require('./templates/views/finalsResults');

const app = express();
const PORT = 5421;
const TOURNAMENT_ID = process.argv[2] ? parseInt(process.argv[2], 10) : 16;

app.use('/styles', express.static(__dirname + '/styles'));

// Full page routes
app.get('/', async (req, res) => {
    try {
        const { count, matches } = await getRecentMatches(TOURNAMENT_ID);
        const content = generateRecentView(matches, count);
        const html = `${generateHeader('Tournament Status Page')}<div id="content" hx-get="/recent-update" hx-trigger="every 30s" hx-swap="innerHTML">${content}</div>${generateFooter()}`;
        res.send(html);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server Error');
    }
});

app.get('/view2', async (req, res) => {
    try {
        const data = await getGroupFixtures(TOURNAMENT_ID);
        const content = generateGroupFixtures(data);
        const html = `${generateHeader('Group Fixtures')}<div id="content" hx-get="/view2-update" hx-trigger="every 30s" hx-swap="innerHTML">${content}</div>${generateFooter()}`;
        res.send(html);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server Error');
    }
});

app.get('/view3', async (req, res) => {
    try {
        const data = await getGroupStandings(TOURNAMENT_ID);
        const content = generateGroupStandings(data);
        const html = `${generateHeader('Group Standings')}<div id="content" hx-get="/view3-update" hx-trigger="every 30s" hx-swap="innerHTML">${content}</div>${generateFooter()}`;
        res.send(html);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server Error');
    }
});

app.get('/view4', async (req, res) => {
    try {
        const data = await getKnockoutFixtures(TOURNAMENT_ID);
        const content = generateKnockoutFixtures(data);
        const html = `${generateHeader('Knockout Fixtures')}<div id="content" hx-get="/view4-update" hx-trigger="every 30s" hx-swap="innerHTML">${content}</div>${generateFooter()}`;
        res.send(html);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server Error');
    }
});

app.get('/view5', async (req, res) => {
    try {
        const data = await getCardedPlayers(TOURNAMENT_ID);
        const content = generateCardedPlayers(data);
        const html = `${generateHeader('Carded Players')}<div id="content" hx-get="/view5-update" hx-trigger="every 30s" hx-swap="innerHTML">${content}</div>${generateFooter()}`;
        res.send(html);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server Error');
    }
});

app.get('/view6', async (req, res) => {
    try {
        const data = await getMatchesByPitch(TOURNAMENT_ID);
        const content = generateMatchesByPitch(data);
        const html = `${generateHeader('Matches by Pitch')}<div id="content" hx-get="/view6-update" hx-trigger="every 30s" hx-swap="innerHTML">${content}</div>${generateFooter()}`;
        res.send(html);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server Error');
    }
});

app.get('/view7', async (req, res) => {
    try {
        const data = await getFinalsResults(TOURNAMENT_ID);
        const content = generateFinalsResults(data);
        const html = `${generateHeader('Finals Results')}<div id="content" hx-get="/view7-update" hx-trigger="every 30s" hx-swap="innerHTML">${content}</div>${generateFooter()}`;
        res.send(html);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server Error');
    }
});

// Partial update routes
app.get('/recent-update', async (req, res) => {
    try {
        const { count, matches } = await getRecentMatches(TOURNAMENT_ID);
        res.send(generateRecentView(matches, count));
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server Error');
    }
});

app.get('/view2-update', async (req, res) => {
    try {
        const data = await getGroupFixtures(TOURNAMENT_ID);
        res.send(generateGroupFixtures(data));
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server Error');
    }
});

app.get('/view3-update', async (req, res) => {
    try {
        const data = await getGroupStandings(TOURNAMENT_ID);
        res.send(generateGroupStandings(data));
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server Error');
    }
});

app.get('/view4-update', async (req, res) => {
    try {
        const data = await getKnockoutFixtures(TOURNAMENT_ID);
        res.send(generateKnockoutFixtures(data));
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server Error');
    }
});

app.get('/view5-update', async (req, res) => {
    try {
        const data = await getCardedPlayers(TOURNAMENT_ID);
        res.send(generateCardedPlayers(data));
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server Error');
    }
});

app.get('/view6-update', async (req, res) => {
    try {
        const data = await getMatchesByPitch(TOURNAMENT_ID);
        res.send(generateMatchesByPitch(data));
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server Error');
    }
});

app.get('/view7-update', async (req, res) => {
    try {
        const data = await getFinalsResults(TOURNAMENT_ID);
        res.send(generateFinalsResults(data));
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} for Tournament ID ${TOURNAMENT_ID}`);
});
