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
const { processPastedFixtures } = require('../../../../dist/src/import/parse')

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

    const { importMethod, pastedData } = req.body;
    let csvContent = '';
    let errorMessage = null;
    let csvData = null;

    try {
        if (importMethod === 'paste') {
            if (!pastedData || pastedData.trim() === '') {
                errorMessage = 'No data pasted.';
            } else {
                csvContent = processPastedFixtures(pastedData).csv;
            }
        } else { // Default to 'upload'
            if (!req.files || !req.files.file) {
                errorMessage = 'No file uploaded.';
            } else {
                const file = req.files.file;
                csvContent = file.data.toString('utf8');
            }
        }

        if (!errorMessage && csvContent) {
            const rows = csvRows(csvContent); // Use the existing csvRows parser
            csvData = rows.map(row => ({
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
        }

        // Generate response HTML (either with data or error message)
        let responseHtml = generateImportFixtures(tournamentId, csvData); // Pass csvData (null if error or no data)

        if (errorMessage) {
            // Inject error message into the generated HTML
            responseHtml = responseHtml.replace(
                '</form>', // Find the end of the form
                `</form><p class="text-red-600 mt-4">${errorMessage}</p>` // Add error message after the form
            );
        } else if (importMethod === 'paste' && csvData) {
             // Optionally add a success message for paste
             responseHtml = responseHtml.replace(
                '</form>', 
                `</form><p class="text-green-600 mt-4">Pasted data received and processed. Please validate.</p>` 
            );
        }

        const fullPageHtml = `
          ${generateHeader('Import Fixtures - Tournament ' + tournamentId, tournamentId, 'planning', null, true)}
          ${responseHtml}
          ${generateFooter()}
        `;
        res.send(fullPageHtml);

    } catch (error) {
        console.log(error)
        console.error('Error processing import:', error.message);
        // Generate response with error message
        let errorResponseHtml = generateImportFixtures(tournamentId); // Start with the base form
        errorResponseHtml = errorResponseHtml.replace(
            '</form>',
            `</form><p class="text-red-600 mt-4">Error processing import: ${error.message}</p>`
        );
        const fullPageErrorHtml = `
          ${generateHeader('Import Fixtures - Tournament ' + tournamentId, tournamentId, 'planning', null, true)}
          ${errorResponseHtml}
          ${generateFooter()}
        `;
        res.send(fullPageErrorHtml);
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
    let html = ''
    const tournamentId = parseInt(req.params.id, 10);
    if (!isLoggedIn) {
        html = `
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
        html = `${generateHeader('Import Fixtures - Tournament ' + tournamentId, tournamentId, 'planning', null, true)}`
        html += `${generateImportFixtures(tournamentId, csvData, validationResult)}`
        html += `${generateFooter()}`;
        res.send(html);
    } catch (error) {
        console.log(error)
        console.error('Error validating fixtures:', error.message);
        html = `${generateHeader('Import Fixtures - Tournament ' + tournamentId, tournamentId, 'planning', null, true)}${generateImportFixtures(tournamentId)}<p style="color: red;">Error validating fixtures: ${error.message}</p>${generateFooter()}`;
        res.send(html);
    }
});

module.exports = router;
