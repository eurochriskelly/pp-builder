const express = require('express');
const { csvRows } = require('./planning');
const { getAllMatches } = require('../../queries/tournaments');
const generateHeader = require('../../templates/header');
const generateFooter = require('../../templates/footer');
const generateMatchesPlanning = require('../../templates/views/planning/matches/');
const generateImportFixtures = require('../../templates/views/planning/importFixtures');
const { apiRequest } = require('../../api');
const { play } = require('../../../../dist/src/simulation');
const { validateFixtures } = require('../../../../dist/src/import/validate');
const { generateFixturesImport } = require('../../../../dist/src/import');

const router = express.Router();

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

module.exports = router;
