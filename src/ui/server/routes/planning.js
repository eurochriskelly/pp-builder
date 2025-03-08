const express = require('express');
const { getAllMatches } = require('../../queries/tournaments');
const generateHeader = require('../../templates/header');
const generateFooter = require('../../templates/footer');
const generateMatchesPlanning = require('../../templates/views/planning/matches/');
const generateTournamentInfo = require('../../templates/views/planning/tournamentInfo');
const generateImportFixtures = require('../../templates/views/planning/importFixtures');
const { apiRequest } = require('../../api');
const { play } = require('../../../../dist/src/simulation');
const { validateFixtures } = require('../../../../dist/src/import/validate');
const { generateFixturesImport } = require('../../../../dist/src/import');

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
        console.error('Error in /planning/:id:', error.message);
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

router.post('/planning/:id/simulate/:count', async (req, res) => {
    const tournamentId = parseInt(req.params.id, 10);
    const count = parseInt(req.params.count, 10);
    try {
        console.log(`Simulating ${count} matches for tournament ${tournamentId}...`);
        await play(tournamentId, null, count);
        const matches = await getAllMatches(tournamentId);
        console.log(`Post-simulation matches: ${matches.length} found`);
        const content = generateMatchesPlanning({ tournamentId, matches });
        res.send(content);
    } catch (error) {
        console.error('Error simulating matches:', error.message);
        res.status(500).send('Simulation Error');
    }
});

router.get('/planning/:id/import-fixtures', (req, res) => {
    const isLoggedIn = !!req.session.user;
    const tournamentId = parseInt(req.params.id, 10);
    if (!isLoggedIn) {
        const html = `
           ${generateHeader('Access Denied', null, null, null, false)}
           <p>Please log in to import fixtures.</p><a href="/" hx-get="/" hx-target="body" hx-swap="outerHTML">Back to Home</a>
           ${generateFooter()}
        `;
        res.send(html);
        return;
    }
    const html = `
      ${generateHeader('Import Fixtures - Tournament ' + tournamentId, tournamentId, 'planning', null, true)}
      ${generateImportFixtures(tournamentId)}
      ${generateFooter()}
    `;
    res.send(html);
});

router.post('/planning/:id/import-fixtures', async (req, res) => {
    const isLoggedIn = !!req.session.user;
    const tournamentId = parseInt(req.params.id, 10);
    if (!isLoggedIn) {
        const html = `
          ${generateHeader('Access Denied', null, null, null, false)}
          <p>Please log in to import fixtures.</p><a href="/" hx-get="/" hx-target="body" hx-swap="outerHTML">Back to Home</a>
          ${generateFooter()}`;
        res.send(html);
        return;
    }

    if (!req.files || !req.files.file) {
        const html = `
          ${generateHeader('Import Fixtures - Tournament ' + tournamentId, tournamentId, 'planning', null, true)}
          ${generateImportFixtures(tournamentId)}<p style="color: red;">No file uploaded.</p>
          ${generateFooter()}
        `;
        res.send(html);
        return;
    }

    try {
        const file = req.files.file;
        const csvContent = file.data.toString('utf8');
        const rows = csvRows(csvContent);
        const csvData = rows.map(row => ({
            matchId: row[0],
            startTime: row[1],
            pitch: row[2],
            stage: row[3],
            category: row[4],
            group: row[5],
            team1: row[6],
            team2: row[7],
            umpireTeam: row[8],
            duration: row[9],
            pool1: row[10],
            pool1Id: row[11],
            position1: row[12],
            pool2: row[13],
            pool2Id: row[14],
            position2: row[15],
            poolUmp: row[16],
            poolUmpId: row[17],
            positionUmp: row[18],
        }));
        const html = `
          ${generateHeader('Import Fixtures - Tournament ' + tournamentId, tournamentId, 'planning', null, true)}
          ${generateImportFixtures(tournamentId, csvData)}
          ${generateFooter()}
        `;
        res.send(html);
    } catch (error) {
        console.error('Error processing file:', error.message);
        const html = `${generateHeader('Import Fixtures - Tournament ' + tournamentId, tournamentId, 'planning', null, true)}${generateImportFixtures(tournamentId)}<p style="color: red;">Error processing file: ${error.message}</p>${generateFooter()}`;
        res.send(html);
    }
});

router.post('/planning/:id/confirm-import', async (req, res) => {
    const isLoggedIn = !!req.session.user;
    const tournamentId = parseInt(req.params.id, 10);
    if (!isLoggedIn) {
        const html = `${generateHeader('Access Denied', null, null, null, false)}<p>Please log in to import fixtures.</p><a href="/" hx-get="/" hx-target="body" hx-swap="outerHTML">Back to Home</a>${generateFooter()}`;
        res.send(html);
        return;
    }

    const { csvData: csvDataString } = req.body;
    let csvData;
    try {
        csvData = JSON.parse(decodeURIComponent(csvDataString));
    console.log(csvData[2])
        const tournamentResponse = await apiRequest('get', `/tournaments/${tournamentId}`);
        const { Date: startDate, Title: title, Location: location } = tournamentResponse.data;
        const importData = {
            tournamentId,
            startDate,
            title,
            location,
            pinCode: 'default', // Still needed for compatibility, adjust if not required
            activities: csvData,
        };
        await generateFixturesImport(importData);
        const matches = await getAllMatches(tournamentId);
        const content = generateMatchesPlanning({ tournamentId, matches });
        const html = `${generateHeader('Planning - Tournament ' + tournamentId, tournamentId, 'planning', null, true)}${content}${generateFooter()}`;
        res.send(html);
    } catch (error) {
        console.error('Error confirming import:', error.message);
        const html = `${generateHeader('Import Fixtures - Tournament ' + tournamentId, tournamentId, 'planning', null, true)}${generateImportFixtures(tournamentId, csvData || [])}<p style="color: red;">Error importing fixtures: ${error.message}</p>${generateFooter()}`;
        res.send(html);
    }
});

router.post('/planning/:id/check-import', async (req, res) => {
    const isLoggedIn = !!req.session.user;
    const tournamentId = parseInt(req.params.id, 10);
    if (!isLoggedIn) {
        const html = `
          ${generateHeader('Access Denied', null, null, null, false)}
          <p>Please log in to import fixtures.</p><a href="/" hx-get="/" hx-target="body" hx-swap="outerHTML">Back to Home</a>
          ${generateFooter()}
        `;
        res.send(html);
        return;
    }

    try {
        const { csvContent } = req.body;
        const csvData = JSON.parse(decodeURIComponent(csvContent));
        const { isValid, warnings } = validateFixtures(csvData);
        const html = `
          ${generateHeader('Import Fixtures - Tournament ' + tournamentId, tournamentId, 'planning', null, true)}
          ${generateImportFixtures(tournamentId, csvData, warnings)}
          ${generateFooter()}
        `;
        res.send(html);
    } catch (error) {
        console.error('Error validating import:', error.message);
        const html = `
          ${generateHeader('Import Fixtures - Tournament ' + tournamentId, tournamentId, 'planning', null, true)}
          ${generateImportFixtures(tournamentId)}<p style="color: red;">Error validating import: ${error.message}</p>
          ${generateFooter()}
        `;
        res.send(html);
    }
});

router.post('/planning/:id/validate-fixtures', async (req, res) => {
    const isLoggedIn = !!req.session.user;
    const tournamentId = parseInt(req.params.id, 10);
    if (!isLoggedIn) {
        const html = `
          ${generateHeader('Access Denied', null, null, null, false)}
          <p>Please log in to import fixtures.</p><a href="/" hx-get="/" hx-target="body" hx-swap="outerHTML">Back to Home</a>
          ${generateFooter()}
        `;
        res.send(html);
        return;
    }
    try {
        const { csvData: csvDataString } = req.body;
        const csvData = JSON.parse(decodeURIComponent(csvDataString));
        const validationResult = validateFixtures(csvData);
        const html = `${generateHeader('Import Fixtures - Tournament ' + tournamentId, tournamentId, 'planning', null, true)}${generateImportFixtures(tournamentId, csvData, validationResult)}${generateFooter()}`;
        res.send(html);
    } catch (error) {
        console.error('Error validating fixtures:', error.message);
        const html = `${generateHeader('Import Fixtures - Tournament ' + tournamentId, tournamentId, 'planning', null, true)}${generateImportFixtures(tournamentId)}<p style="color: red;">Error validating fixtures: ${error.message}</p>${generateFooter()}`;
        res.send(html);
    }
});

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

module.exports = router;
