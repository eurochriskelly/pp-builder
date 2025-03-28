const express = require('express');
const { getTournamentByUuid } = require('../../queries');
const generateHeader = require('../../templates/header');
const generateFooter = require('../../templates/footer');
const { generateEventManager } = require('../../templates/views/eventManager');
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

// Removed unused generateStandingsHeaders function from here

router.get('/event/:uuid/:view?', async (req, res) => {
    const uuid = req.params.uuid;
    const view = req.params.view || 'view7'; // Default to 'finals results' if no view provided
    const tournament = await getTournamentAndHandleErrors(uuid, res);
    if (!tournament) return;
    const tournamentId = tournament.id;
    if (!allowedViews[view]) {
        const isLoggedIn = !!req.session.user;
        const html = `
          ${generateHeader('Not Allowed', tournamentId, 'execution', null, isLoggedIn, false)}
          <link rel="stylesheet" media="(min-width: 1000px)" href="/styles/desktop.css">
          <link rel="stylesheet" media="(max-width: 999px)" href="/styles/mobile.css">
          
          <p>View not accessible via public URL.</p>
          ${generateEventManager(tournamentId, uuid, tournament, isLoggedIn)}
        }`;
        return res.status(403).send(html);
    }

    const isLoggedIn = !!req.session.user;
    const { title } = allowedViews[view]; // Only need title here now

    try {
        // Use the helper function to get the main content
        const content = await generateViewContent(view, tournamentId); 

        const html = `
          <div style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
            ${generateEventManager(tournamentId, uuid, tournament, isLoggedIn)}
          </div>
          ${generateHeader(title, tournamentId, 'execution', view, isLoggedIn, false)}
          <div id="content" hx-get="/event/${uuid}/${view}-update" hx-trigger="every 30s" hx-swap="innerHTML">
            ${content} 
          </div>
          ${generateFooter()}
        `;
        res.send(html);
    } catch (error) {
         // Handle potential errors during content generation
         console.error(`Error generating main view ${view} for tournament ${tournamentId}:`, error.message);
         // Send a generic error page
         res.status(500).send(`${generateHeader('Server Error', null, null, null, isLoggedIn, false)}<p>An error occurred while loading the page content.</p>${generateFooter()}`);
    }
});


// Helper function to fetch data and generate content for a specific view
async function generateViewContent(view, tournamentId) {
    if (!allowedViews[view]) {
        throw new Error(`Invalid view specified: ${view}`); // Should be caught by caller
    }
    const { fetch, generator } = allowedViews[view];
    try {
        const data = await fetch(tournamentId);
        // Handle the special case for 'recent' view generator signature
        const content = view === 'recent' ? generator(data.matches, data.count) : generator(data);
        return content;
    } catch (error) {
        console.error(`Error generating content for view ${view}, tournament ${tournamentId}:`, error.message);
        // Return an error message or throw to be handled by the route
        return `<p class="error">Error loading data for ${allowedViews[view].title}. Please try again later.</p>`; 
    }
}

// Setup update routes using the helper
Object.keys(allowedViews).forEach(view => {
    router.get(`/event/:uuid/${view}-update`, async (req, res) => {
        const uuid = req.params.uuid;
        // Use the existing error handling for tournament fetching
        const tournament = await getTournamentAndHandleErrors(uuid, res); 
        if (!tournament) return; // Error response already sent by getTournamentAndHandleErrors

        try {
            const content = await generateViewContent(view, tournament.id);
            res.send(content);
        } catch (error) {
            // Handle errors from generateViewContent itself (e.g., invalid view)
            // Although getTournamentAndHandleErrors should catch most issues earlier
            console.error(`Error in update route for view ${view}:`, error.message);
            res.status(500).send(`<p class="error">Internal server error generating view update.</p>`);
        }
    });
});

// Modify the main view route to also use the helper (optional but consistent)
// Note: This requires adjusting the main route logic slightly if you adopt it.
// Example modification (Illustrative - apply carefully):
/*
router.get('/event/:uuid/:view?', async (req, res) => {
    const uuid = req.params.uuid;
    const view = req.params.view || 'view7'; // Default view
    const tournament = await getTournamentAndHandleErrors(uuid, res);
    if (!tournament) return;
    const tournamentId = tournament.id;
    const isLoggedIn = !!req.session.user;

    if (!allowedViews[view]) {
        // ... (keep existing 403 handling) ...
        return res.status(403).send(html);
    }

    try {
        const content = await generateViewContent(view, tournamentId); // Use the helper
        const { title } = allowedViews[view];
        const html = `
          <div style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
            ${generateEventManager(tournamentId, uuid, tournament, isLoggedIn)}
          </div>
          ${generateHeader(title, tournamentId, 'execution', view, isLoggedIn, false)}
          <div id="content" hx-get="/event/${uuid}/${view}-update" hx-trigger="every 30s" hx-swap="innerHTML">
            ${content} 
          </div>
          ${generateFooter()}
        `;
        res.send(html);
    } catch (error) {
         console.error(`Error in main route for view ${view}:`, error.message);
         res.status(500).send(`${generateHeader('Server Error', null, null, null, false, false)}Server Error${generateFooter()}`);
    }
});
*/

module.exports = router;
