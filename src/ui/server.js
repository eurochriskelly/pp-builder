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
const { getTournaments } = require('../../dist/src/simulation/retrieve'); // Import from simulation
const generateHeader = require('./templates/header');
const generateFooter = require('./templates/footer');
const generateTournamentSelection = require('./templates/views/tournamentSelection');
const generateRecentView = require('./templates/views/recent');
const generateGroupFixtures = require('./templates/views/groupFixtures');
const generateGroupStandings = require('./templates/views/groupStandings');
const generateKnockoutFixtures = require('./templates/views/knockoutFixtures');
const generateCardedPlayers = require('./templates/views/cardedPlayers');
const generateMatchesByPitch = require('./templates/views/matchesByPitch');
const generateFinalsResults = require('./templates/views/finalsResults');

const app = express();
const PORT = 5421;

app.use('/styles', express.static(__dirname + '/styles'));

// Tournament selection page
app.get('/', async (req, res) => {
    try {
        const tournaments = await getTournaments();
        if (tournaments.length === 0) {
            res.send(`${generateHeader('Tournament Selection')}No tournaments available.${generateFooter()}`);
            return;
        }
        const content = generateTournamentSelection(tournaments);
        const html = `${generateHeader('Tournament Selection')}${content}${generateFooter()}`;
        res.send(html);
    } catch (error) {
        console.error('Error fetching tournaments:', error);
        res.status(500).send('Server Error');
    }
});

// Tournament-specific routes
app.get('/tournament/:id', async (req, res) => {
    const tournamentId = parseInt(req.params.id, 10);
    try {
        const { count, matches } = await getRecentMatches(tournamentId);
        const content = generateRecentView(matches, count);
        const html = `${generateHeader('Tournament Status Page')}<div id="content" hx-get="/tournament/${tournamentId}/recent-update" hx-trigger="every 30s" hx-swap="innerHTML">${content}</div>${generateFooter()}`;
        res.send(html);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server Error');
    }
});

app.get('/tournament/:id/view2', async (req, res) => {
    const tournamentId = parseInt(req.params.id, 10);
    try {
        const data = await getGroupFixtures(tournamentId);
        const content = generateGroupFixtures(data);
        const html = `${generateHeader('Group Fixtures')}<div id="content" hx-get="/tournament/${tournamentId}/view2-update" hx-trigger="every 30s" hx-swap="innerHTML">${content}</div>${generateFooter()}`;
        res.send(html);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server Error');
    }
});

app.get('/tournament/:id/view3', async (req, res) => {
    const tournamentId = parseInt(req.params.id, 10);
    try {
        const data = await getGroupStandings(tournamentId);
        const content = generateGroupStandings(data);
        const html = `${generateHeader('Group Standings')}<div id="content" hx-get="/tournament/${tournamentId}/view3-update" hx-trigger="every 30s" hx-swap="innerHTML">${content}</div>${generateFooter()}`;
        res.send(html);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server Error');
    }
});

app.get('/tournament/:id/view4', async (req, res) => {
    const tournamentId = parseInt(req.params.id, 10);
    try {
        const data = await getKnockoutFixtures(tournamentId);
        const content = generateKnockoutFixtures(data);
        const html = `${generateHeader('Knockout Fixtures')}<div id="content" hx-get="/tournament/${tournamentId}/view4-update" hx-trigger="every 30s" hx-swap="innerHTML">${content}</div>${generateFooter()}`;
        res.send(html);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server Error');
    }
});

app.get('/tournament/:id/view5', async (req, res) => {
    const tournamentId = parseInt(req.params.id, 10);
    try {
        const data = await getCardedPlayers(tournamentId);
        const content = generateCardedPlayers(data);
        const html = `${generateHeader('Carded Players')}<div id="content" hx-get="/tournament/${tournamentId}/view5-update" hx-trigger="every 30s" hx-swap="innerHTML">${content}</div>${generateFooter()}`;
        res.send(html);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server Error');
    }
});

app.get('/tournament/:id/view6', async (req, res) => {
    const tournamentId = parseInt(req.params.id, 10);
    try {
        const data = await getMatchesByPitch(tournamentId);
        const content = generateMatchesByPitch(data);
        const html = `${generateHeader('Matches by Pitch')}<div id="content" hx-get="/tournament/${tournamentId}/view6-update" hx-trigger="every 30s" hx-swap="innerHTML">${content}</div>${generateFooter()}`;
        res.send(html);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server Error');
    }
});

app.get('/tournament/:id/view7', async (req, res) => {
    const tournamentId = parseInt(req.params.id, 10);
    try {
        const data = await getFinalsResults(tournamentId);
        const content = generateFinalsResults(data);
        const html = `${generateHeader('Finals Results')}<div id="content" hx-get="/tournament/${tournamentId}/view7-update" hx-trigger="every 30s" hx-swap="innerHTML">${content}</div>${generateFooter()}`;
        res.send(html);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server Error');
    }
});

// Partial update routes
app.get('/tournament/:id/recent-update', async (req, res) => {
    const tournamentId = parseInt(req.params.id, 10);
    try {
        const { count, matches } = await getRecentMatches(tournamentId);
        res.send(generateRecentView(matches, count));
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server Error');
    }
});

app.get('/tournament/:id/view2-update', async (req, res) => {
    const tournamentId = parseInt(req.params.id, 10);
    try {
        const data = await getGroupFixtures(tournamentId);
        res.send(generateGroupFixtures(data));
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server Error');
    }
});

app.get('/tournament/:id/view3-update', async (req, res) => {
    const tournamentId = parseInt(req.params.id, 10);
    try {
        const data = await getGroupStandings(tournamentId);
        res.send(generateGroupStandings(data));
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server Error');
    }
});

app.get('/tournament/:id/view4-update', async (req, res) => {
    const tournamentId = parseInt(req.params.id, 10);
    try {
        const data = await getKnockoutFixtures(tournamentId);
        res.send(generateKnockoutFixtures(data));
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server Error');
    }
});

app.get('/tournament/:id/view5-update', async (req, res) => {
    const tournamentId = parseInt(req.params.id, 10);
    try {
        const data = await getCardedPlayers(tournamentId);
        res.send(generateCardedPlayers(data));
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server Error');
    }
});

app.get('/tournament/:id/view6-update', async (req, res) => {
    const tournamentId = parseInt(req.params.id, 10);
    try {
        const data = await getMatchesByPitch(tournamentId);
        res.send(generateMatchesByPitch(data));
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server Error');
    }
});

app.get('/tournament/:id/view7-update', async (req, res) => {
    const tournamentId = parseInt(req.params.id, 10);
    try {
        const data = await getFinalsResults(tournamentId);
        res.send(generateFinalsResults(data));
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}. Visit http://localhost:${PORT} to select a tournament.`);
});
