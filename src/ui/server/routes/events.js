const express = require('express');
const express = require('express');
const { getTournamentByUuid } = require('../../queries');
// Import the combined data fetch function directly if needed, or rely on allowedViews config
const { getCompetitionData } = require('../../queries/matches');
const generateHeader = require('../../templates/header');
const generateFooter = require('../../templates/footer');
const { generateEventManager } = require('../../templates/views/eventManager');
// Remove generateCompetitionViewMenu import - no longer needed
// const { generateCompetitionViewMenu } = require('../../templates/partials/competitionViewMenu');
const { allowedViews } = require('../../config/allowedViews');

const router = express.Router();

async function getTournamentAndHandleErrors(uuid, res) {
    try {
        const response = await getTournamentByUuid(uuid);
        const tournament = response.data;
        if (!tournament || !tournament.id) {
            const html = `${generateHeader('Not Found', null, null, null, false, false)}<p>Tournament not found for UUID: ${uuid}</p>${generateFooter()}`;
            res.status(404).send(html);
            return null;
        }
        return tournament;
    } catch (error) {
        console.error(`Error fetching tournament for UUID ${uuid}:`, error.message);
        res.status(500).send(`${generateHeader('Server Error', null, null, null, false, false)}Server Error${generateFooter()}`);
        return null;
    }
}

// Removed unused generateStandingsHeaders function

// NEW Route to handle fetching and displaying the combined competition view
router.get('/event/:uuid/competition-update', async (req, res) => {
    const uuid = req.params.uuid;
    const competitionName = req.query.competition;

    if (!competitionName) {
        return res.status(400).send('<p class="error p-4">Competition name is required.</p>');
    }

    const tournament = await getTournamentAndHandleErrors(uuid, res);
    if (!tournament) return;

    try {
        // Fetch the combined data for the specific competition
        const competitionData = await getCompetitionData(tournament.id, competitionName);

        // Get the generator function from allowedViews config
        const { generator } = allowedViews['competition']; // Use the key we defined ('competition')
        if (!generator) {
             throw new Error("Competition view generator not found in allowedViews.");
        }

        // Generate the HTML content using the combined data
        const content = generator(competitionData);

        // Prepend the H1 title (using the actual competition name)
        const responseHtml = `<h1>${competitionName}</h1>${content}`;

        res.send(responseHtml);

    } catch (error) {
        console.error(`Error fetching/generating competition view for ${competitionName} in tournament ${uuid}:`, error.message);
        res.status(500).send(`<h1 class="error">${competitionName}</h1><p class="error p-4">Error loading data for ${competitionName}. Please try again later.</p>`);
    }
});


// REMOVE individual view update routes (or comment out if needed temporarily)
/*
Object.keys(allowedViews).forEach(view => {
    // Keep only if views other than 'competition' exist and need updates
    if (view !== 'competition') {
        router.get(`/event/:uuid/${view}-update`, async (req, res) => {
           // ... existing logic for other views if any ...
        });
    }
});
*/

// Main route for displaying the event page (initial load)
router.get('/event/:uuid', async (req, res) => { // Removed optional :view? parameter
    const uuid = req.params.uuid;
    // const requestedView = req.params.view; // No longer needed for initial load
    const tournament = await getTournamentAndHandleErrors(uuid, res);
    if (!tournament) return;
    const tournamentId = tournament.id;
    const isLoggedIn = !!req.session.user;

    // Title for the <title> tag
    let pageTitle = tournament.title || 'Event Overview'; // Use tournament title or default
    // let currentView = null; // No specific view selected initially

    // Default placeholder content for the #content div
    let content = '<p class="p-4 text-gray-600">Select a competition above to view details.</p>';
    // Set the ID for the content div, polling will be added dynamically by eventManager links
    let contentAttributes = 'id="content"';

    // Construct the final HTML for initial page load
    try {
        // generateEventManager handles competition selection links
        const eventManagerHtml = generateEventManager(tournamentId, uuid, tournament, isLoggedIn);

        const html = `
          ${generateHeader(pageTitle, tournamentId, 'execution', null, isLoggedIn, false)}
          <div style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
            ${eventManagerHtml}
          </div>
          <div ${contentAttributes}>
            ${content} <!-- Initial placeholder content -->
          </div>
          ${generateFooter()}
        `;
        res.send(html);
    } catch (error) {
         console.error(`Error generating full page structure for tournament ${tournamentId}:`, error.message);
         res.status(500).send(`${generateHeader('Server Error', null, null, null, isLoggedIn, false)}<p>An error occurred while loading the page structure.</p>${generateFooter()}`);
    }
});


// REMOVE the generateViewContent helper function as it's no longer needed
/*
async function generateViewContent(view, tournamentId, competitionName = null) {
    // ... function content removed ...
}
*/

// REMOVE the example modification block at the end

module.exports = router;
