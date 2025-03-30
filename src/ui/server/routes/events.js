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

        // 2. Generate the default view content (Finals), getting title and content
        const { title: defaultViewTitle, content: defaultViewContent } = await generateViewContent(defaultView, tournament.id, competitionName);

        // 3. Construct the response with OOB swap for the menu and H1 prepended to main content
        const oobMenu = `<div id="competition-content" hx-swap-oob="innerHTML">${secondMenuHtml}</div>`;
        // Prepend H1 to the default view content
        const mainContentWithTitle = `<h1>${defaultViewTitle}</h1>${defaultViewContent}`;
        const responseHtml = mainContentWithTitle + oobMenu; // Combine main content (with H1) and OOB swap

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
            // Pass competitionName to generateViewContent, get title and content
            const { title, content } = await generateViewContent(view, tournament.id, competitionName);
            // Prepend H1 to the content for the swap
            res.send(`<h1>${title}</h1>${content}`);
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

    // Title for the <title> tag and potentially header.js if navigation=true
    let pageTitle = 'Event Overview'; 
    let currentView = null;
    let content = '<p class="p-4 text-gray-600">Select a competition above to view details.</p>'; // Default placeholder for #content
    let contentAttributes = 'id="content"'; // Default attributes for the content div

    if (requestedView) {
        currentView = requestedView;
        // Check if the requested view is valid *before* trying to generate content
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

        // Valid view requested, proceed to generate its content including H1
        const competitionName = req.query.competition; // Extract competition name from query
        try {
            // Get title and content object
            const { title: viewTitle, content: viewContent } = await generateViewContent(currentView, tournamentId, competitionName);
            pageTitle = viewTitle; // Update the page title for the <title> tag
            // Prepend H1 to the content for the initial load
            content = `<h1>${viewTitle}</h1>${viewContent}`;
            // Add HTMX polling attributes, including competitionName in the hx-get URL
            const pollingUrl = `/event/${uuid}/${currentView}-update${competitionName ? `?competition=${encodeURIComponent(competitionName)}` : ''}`;
            contentAttributes = `id="content" hx-get="${pollingUrl}" hx-trigger="every 30s" hx-swap="innerHTML"`;
        } catch (error) {
            console.error(`Error generating main view ${currentView} for tournament ${tournamentId} (competition: ${competitionName}):`, error.message);
            pageTitle = 'Server Error'; // Update page title for error
            content = `<p class="error p-4">An error occurred while loading the content for ${allowedViews[currentView]?.title || 'this view'}.</p>`;
            // No polling on error
            contentAttributes = 'id="content"';
        }
    }
    // Else: No specific view requested, use the default pageTitle and placeholder content defined above

    // Construct the final HTML
    try {
        // generateEventManager now handles the competition selection and the initial placeholder/menu area
        const eventManagerHtml = generateEventManager(tournamentId, uuid, tournament, isLoggedIn);

        const html = `
          ${generateHeader(pageTitle, tournamentId, 'execution', currentView, isLoggedIn, false)} 
          <div style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
            ${eventManagerHtml} 
          </div>
          <div ${contentAttributes}>
            ${content} <!-- Initial content (placeholder or view with H1) -->
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
    const { title, fetch, generator } = allowedViews[view]; // Get title from config
    try {
        // Pass competitionName to the fetch function
        const data = await fetch(tournamentId, competitionName);
        // Handle the special case for 'recent' view generator signature
        const generatedHtml = view === 'recent' ? generator(data.matches, data.count) : generator(data);
        // Return title and generated content
        return { title: title, content: generatedHtml };
    } catch (error) {
        console.error(`Error generating content for view ${view}, tournament ${tournamentId} (competition: ${competitionName}):`, error.message);
        // Return title and an error message as content
        return { title: title || 'Error', content: `<p class="error">Error loading data for ${title || 'this view'}. Please try again later.</p>` };
    }
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
