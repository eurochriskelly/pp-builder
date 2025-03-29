const express = require('express');
const { getTournamentByUuid } = require('../../queries');
const generateHeader = require('../../templates/header');
const generateFooter = require('../../templates/footer');
const { generateEventManager } = require('../../templates/views/eventManager');
const { generateCompetitionViewMenu } = require('../../templates/partials/competitionViewMenu'); // Import the new menu generator
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

// Route to handle selecting a competition and returning the secondary menu + default view
router.get('/event/:uuid/select-competition', async (req, res) => {
    const uuid = req.params.uuid;
    const competitionName = req.query.competition;
    const defaultView = 'view7'; // Default to Finals view

    if (!competitionName) {
        return res.status(400).send('<p class="error">Competition name is required.</p>');
    }

    const tournament = await getTournamentAndHandleErrors(uuid, res);
    if (!tournament) return;

    try {
        // 1. Generate the secondary menu HTML
        const secondMenuHtml = generateCompetitionViewMenu(uuid, competitionName, defaultView);

        // 2. Generate the default view content (Finals)
        const defaultViewContent = await generateViewContent(defaultView, tournament.id, competitionName);

        // 3. Construct the response with OOB swap for the menu
        const oobMenu = `<div id="competition-content" hx-swap-oob="innerHTML">${secondMenuHtml}</div>`;
        const responseHtml = defaultViewContent + oobMenu; // Combine main content and OOB swap

        res.send(responseHtml);

    } catch (error) {
        console.error(`Error selecting competition ${competitionName} for tournament ${uuid}:`, error.message);
        // Send error message within the main content area, potentially clearing the menu
        const errorHtml = `<p class="error">Error loading data for ${competitionName}.</p>`;
        const oobClearMenu = `<div id="competition-content" hx-swap-oob="innerHTML"><p class="text-gray-600">Error loading menu.</p></div>`;
        res.status(500).send(errorHtml + oobClearMenu);
    }
});


// Setup update routes using the helper
// Define these specific routes *before* the general '/event/:uuid/:view?' route
Object.keys(allowedViews).forEach(view => {
    router.get(`/event/:uuid/${view}-update`, async (req, res) => {
        const uuid = req.params.uuid;
        // Use the existing error handling for tournament fetching
        const tournament = await getTournamentAndHandleErrors(uuid, res); 
        if (!tournament) return; // Error response already sent by getTournamentAndHandleErrors
        
        // Extract competition name from query parameters for filtering
        const competitionName = req.query.competition; 

        try {
            // Pass competitionName to generateViewContent
            const content = await generateViewContent(view, tournament.id, competitionName); 
            res.send(content);
        } catch (error) {
            // Handle errors from generateViewContent itself (e.g., invalid view or fetch error)
            // Although getTournamentAndHandleErrors should catch most issues earlier
            console.error(`Error in update route for view ${view}:`, error.message);
            res.status(500).send(`<p class="error">Internal server error generating view update.</p>`);
        }
    });
});


router.get('/event/:uuid/:view?', async (req, res) => {
    const uuid = req.params.uuid;
    const requestedView = req.params.view; // Get the requested view, might be undefined
    const tournament = await getTournamentAndHandleErrors(uuid, res);
    if (!tournament) return;
    const tournamentId = tournament.id;
    const isLoggedIn = !!req.session.user;

    let title = tournament.title || 'Event Overview'; // Default title
    let currentView = null; // No specific view selected initially
    let content = '<p class="p-4 text-gray-600">Select a competition above to view details.</p>'; // Placeholder for main content
    let contentAttributes = 'id="content"'; // Default attributes for the content div

    if (requestedView) {
        // A specific view was requested in the URL
        if (!allowedViews[requestedView]) {
            // Handle invalid/disallowed view
            const html = `
              ${generateHeader('Not Allowed', tournamentId, 'execution', null, isLoggedIn, false)}
              <link rel="stylesheet" media="(min-width: 1000px)" href="/styles/desktop.css">
              <link rel="stylesheet" media="(max-width: 999px)" href="/styles/mobile.css">
              
              <p>View not accessible via public URL.</p>
              ${generateEventManager(tournamentId, uuid, tournament, isLoggedIn)}
            }`;
            return res.status(403).send(html);
        }

        // Valid view requested, proceed to generate its content
        currentView = requestedView;
        title = allowedViews[currentView].title; // Get title for the specific view
        const competitionName = req.query.competition; // Extract competition name from query
        try {
            // Pass competitionName when generating initial content for a direct view load
            content = await generateViewContent(currentView, tournamentId, competitionName); 
            // Add HTMX polling attributes, including competitionName in the hx-get URL
            const pollingUrl = `/event/${uuid}/${currentView}-update${competitionName ? `?competition=${encodeURIComponent(competitionName)}` : ''}`;
            contentAttributes = `id="content" hx-get="${pollingUrl}" hx-trigger="every 30s" hx-swap="innerHTML"`;
        } catch (error) {
            console.error(`Error generating main view ${currentView} for tournament ${tournamentId} (competition: ${competitionName}):`, error.message);
            content = `<p class="error p-4">An error occurred while loading the content for ${title}.</p>`;
            // Use a generic error header title
            title = 'Server Error'; 
        }
    }
    // Else: No specific view requested, use the default title and placeholder content defined above

    // Construct the final HTML
    try {
        // The second menu is now ONLY added via OOB swap when a competition is selected.
        // The initial state of competition-content should just be the placeholder.
        const placeholderHtml = '<p class="text-gray-600">Select a competition above to view details.</p>';

        const html = `
          <div style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
            ${generateEventManager(tournamentId, uuid, tournament, isLoggedIn)} 
          </div>
          <div id="competition-content" class="competition-content-container p-4 border-t border-gray-200">
             ${placeholderHtml}
          </div>
          ${generateHeader(title, tournamentId, 'execution', currentView, isLoggedIn, false)}
          <div ${contentAttributes}>
            ${content} 
          </div>
          ${generateFooter()}
        `;
        res.send(html);
    } catch (error) {
         // Handle potential errors during final HTML generation (e.g., header/footer/eventManager)
         console.error(`Error generating full page structure for tournament ${tournamentId}:`, error.message);
         // Send a generic error page
         res.status(500).send(`${generateHeader('Server Error', null, null, null, isLoggedIn, false)}<p>An error occurred while loading the page structure.</p>${generateFooter()}`);
    }
});


// Helper function to fetch data and generate content for a specific view, optionally filtered by competition
async function generateViewContent(view, tournamentId, competitionName = null) {
    if (!allowedViews[view]) {
        throw new Error(`Invalid view specified: ${view}`); // Should be caught by caller
    }
    const { fetch, generator } = allowedViews[view];
    try {
        // Pass competitionName to the fetch function
        const data = await fetch(tournamentId, competitionName); 
        // Handle the special case for 'recent' view generator signature
        // Note: 'recent' view might also need competition filtering if applicable
        const content = view === 'recent' ? generator(data.matches, data.count) : generator(data);
        return content;
    } catch (error) {
        console.error(`Error generating content for view ${view}, tournament ${tournamentId}:`, error.message);
        // Return an error message or throw to be handled by the route
        return `<p class="error">Error loading data for ${allowedViews[view].title}. Please try again later.</p>`; 
    } // <-- Added missing closing brace for the function
}
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
