const express = require('express');
const { getAllMatches } = require('../../queries/tournaments');
const generateHeader = require('../../templates/header');
const generateFooter = require('../../templates/footer');
const generateMatchesPlanning = require('../../templates/views/planning/matches');
const generateImportFixtures = require('../../templates/views/importFixtures');
const { apiRequest } = require('../../api');
const { play } = require('../../../../dist/src/simulation');
const { validateFixtures } = require('../../../../dist/src/import/validate');
const { generateFixturesImport } = require('../../../../dist/src/import');

const router = express.Router();

const csvRows = (csv) => {
    const lines = csv.split('\n').filter(x => x.trim());
    const delim = lines[0].includes(',') ? ',' : ';';
    const rows = lines.slice(1).map(row => row.split(delim));
    return rows;
};

router.get('/planning/:id', async (req, res) => {
    const tournamentId = parseInt(req.params.id, 10);
    try {
        console.log(`Fetching all matches for tournament ${tournamentId}...`);
        const matches = await getAllMatches(tournamentId);
        console.log(`Matches received: ${matches.length} items`);
        const isLoggedIn = !!req.session.user;
        const content = generateMatchesPlanning({ tournamentId, matches });
        const html = `${generateHeader('Planning - Tournament ' + tournamentId, tournamentId, 'planning', null, isLoggedIn)}<div id="content">${content}</div>${generateFooter()}`;
        res.send(html);
    } catch (error) {
        console.error('Error in /planning/:id:', error.message);
        res.status(500).send('Server Error');
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
    console.log('csv rows?', csvRows)
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
        }));
        const html = `${generateHeader('Import Fixtures - Tournament ' + tournamentId, tournamentId, 'planning', null, true)}${generateImportFixtures(tournamentId, csvData)}${generateFooter()}`;
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
        console.log('Parsed csvData for import:', csvData);
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

module.exports = router;
