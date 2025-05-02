const express = require('express');
const { getAllMatches } = require('../queries/tournaments');
const generateHeader = require('../../templates/header');
const generateFooter = require('../../templates/footer');
const generateMatchesPlanning = require('../../templates/views/planning/matches/');
const generateTournamentInfo = require('../../templates/views/planning/tournamentInfo');
const { apiRequest } = require('../../api');
const { play } = require('../../../../dist/src/simulation');

const router = express.Router();

const csvRows = (csv) => {
    const lines = csv.split('\n').filter(x => x.trim());
    // Try comma first, then semicolon if that fails
    let delim = ',';
    if (!lines[0].includes(',')) {
        delim = ';';
    }
    // Handle quoted fields that may contain the delimiter
    const rows = lines.slice(1).map(row => {
        const result = [];
        let inQuotes = false;
        let currentField = '';
        for (let i = 0; i < row.length; i++) {
            const char = row[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === delim && !inQuotes) {
                result.push(currentField.trim());
                currentField = '';
            } else {
                currentField += char;
            }
        }
        result.push(currentField.trim()); // Add last field
        return result;
    });
    return rows;
};

router.get('/planning/:id/matches', async (req, res) => {
    const tournamentId = parseInt(req.params.id, 10);
    try {
        const matches = await getAllMatches(tournamentId);
        
        // Get the official nextup order from API
        const nextupResponse = await apiRequest('get', `/tournaments/${tournamentId}/fixtures/nextup`);
        const nextupOrder = nextupResponse.data.map(m => m.id);
        const isLoggedIn = !!req.session.user;
        const content = generateMatchesPlanning({ 
            tournamentId, 
            matches,
            nextupOrder // Pass the API's ordering to the view
        });
        const html = `
          ${generateHeader('Planning - Tournament ' + tournamentId, tournamentId, 'planning', null, isLoggedIn)}
          <div id="content">${content}</div>
          ${generateFooter()}`;
        res.send(html);
    } catch (error) {
        console.error('Error in /planning/:id/matches:', error.message);
        res.status(500).send('Server Error');
    }
});

router.get('/planning/:id/reset', async (req, res) => {
    const tournamentId = parseInt(req.params.id, 10);
    try {
        console.log(`Resetting tournament ${tournamentId}...`);
        await apiRequest('post', `/tournaments/${tournamentId}/reset`); // Changed to POST per OpenAPI spec
        const matches = await getAllMatches(tournamentId);
        console.log(`Post-reset matches: ${matches.length} items`);
        const content = generateMatchesPlanning({ tournamentId, matches });
        res.send(content);
    } catch (error) {
        console.error('Error resetting tournament:', error.message);
        res.status(500).send('Reset Error');
    }
});
const fnSimulate = async (req, res) => {
    const tournamentId = parseInt(req.params.id, 10);
    const count = parseInt(req.params.count, 10);
    const { category } = req.params
    try {
        console.log(`Simulating ${count} matches for tournament ${tournamentId}...`);
        await play(tournamentId, category, count);
        const matches = await getAllMatches(tournamentId);
        console.log(`Post-simulation matches: ${matches.length} found`);
        const content = generateMatchesPlanning({ tournamentId, matches });
        res.send(content);
    } catch (error) {
        console.error('Error simulating matches:', error.message);
        res.status(500).send('Simulation Error');
    }
}
router.post('/planning/:id/simulate/:count/', fnSimulate);
router.post('/planning/:id/simulate/:count/:category', fnSimulate);

router.get('/planning/create-tournament', (req, res) => {
    const isLoggedIn = !!req.session.user;
    if (!isLoggedIn) {
        const html = `
          ${generateHeader('Access Denied', null, null, null, false)}
          <p>Please log in to create a tournament.</p><a href="/" hx-get="/" hx-target="body" hx-swap="outerHTML">Back to Home</a>
          ${generateFooter()}
        `;
        res.send(html);
        return;
    }
    const html = `
      ${generateHeader('Create Tournament', null, 'planning', null, true)}
      ${generateTournamentInfo()}
      ${generateFooter()}
    `;
    res.send(html);
});

router.post('/planning/create-tournament', async (req, res) => {
    const isLoggedIn = !!req.session.user;
    if (!isLoggedIn) {
        res.status(403).send('Unauthorized');
        return;
    }
    const { title, date, location, lat, lon } = req.body;
    try {
        await apiRequest('post', '/tournaments', { title, date, location, lat, lon }); // Create via API
        res.redirect('/');
    } catch (error) {
        console.error('Error creating tournament:', error.message);
        res.status(500).send('Server Error');
    }
});

router.get('/planning/:id/edit-tournament', async (req, res) => {
    const isLoggedIn = !!req.session.user;
    const tournamentId = parseInt(req.params.id, 10);
    if (!isLoggedIn) {
        const html = `
          ${generateHeader('Access Denied', null, null, null, false)}
          <p>Please log in to edit a tournament.</p><a href="/" hx-get="/" hx-target="body" hx-swap="outerHTML">Back to Home</a>
          ${generateFooter()}
        `;
        res.send(html);
        return;
    }
    try {
        const response = await apiRequest('get', `/tournaments/${tournamentId}`);
        const tournament = response.data;
        if (!tournament) return res.status(404).send('Tournament not found');
        res.send(generateHeader('Edit Tournament - ' + tournamentId, tournamentId, 'planning', null, true) + generateTournamentInfo(tournament) + generateFooter());
    } catch (error) {
        console.error('Error fetching tournament:', error.message);
        res.status(404).send('Tournament not found');
    }
});

router.post('/planning/:id/update-tournament', async (req, res) => {
    const isLoggedIn = !!req.session.user;
    const tournamentId = parseInt(req.params.id, 10);
    if (!isLoggedIn) {
        res.status(403).send('Unauthorized');
        return;
    }
    const { title, date, location, lat, lon } = req.body;
    try {
        await apiRequest('put', `/tournaments/${tournamentId}`, { title, date, location, lat, lon }); // Update via API
        res.redirect('/');
    } catch (error) {
        console.error('Error updating tournament:', error.message);
        res.status(500).send('Server Error');
    }
});

router.csvRows = csvRows;
module.exports = router;
