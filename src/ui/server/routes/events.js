const express = require('express');
const { getTournamentByUuid } = require('../queries');
const { getCompetitionData } = require('../queries/matches');
const generateHeader = require('../../templates/header');
const generateFooter = require('../../templates/footer');
const { generateEventManager } = require('../../templates/views/eventManager');
const generateCompetitionView = require('../../templates/views/execution/competitionView');

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

// NEW Route to handle fetching and displaying the combined competition view
router.get('/event/:uuid/competition-update', competitionUpdate.bind(null, false)); // For normal mode
router.get('/event/:uuid/competition-update/edit', competitionUpdate.bind(null, true)); // For edit mode

// Main route for displaying the event page (initial load)
router.get('/event/:uuid', competitionPage.bind(null, false)); // For normal mode
router.get('/event/:uuid/edit', competitionPage.bind(null, true)); // For edit mode

module.exports = router;

async function competitionPage(editable, req, res) { // Removed optional :view? parameter
    const uuid = req.params.uuid;
    const tournament = await getTournamentAndHandleErrors(uuid, res);
    if (!tournament) return;
    const tournamentId = tournament.id;
    const isLoggedIn = !!req.session.user;

    // Title for the <title> tag
    let pageTitle = tournament.title || 'Event Overview'; // Use tournament title or default

    // Construct the final HTML for initial page load
    try {
        // generateEventManager handles competition selection links
        const eventManagerHtml = generateEventManager(uuid, tournament, isLoggedIn, editable);
        const html = `
          ${generateHeader(pageTitle, tournamentId, 'execution', null, isLoggedIn, false)}
          <div style="display: flex;">
            ${eventManagerHtml}
          </div>
          <div id="content"></div>
          ${generateFooter()}
        `;
        res.send(html);
    } catch (error) {
         console.error(`Error generating full page structure for tournament ${tournamentId}:`, error.message);
         res.status(500).send(`${generateHeader('Server Error', null, null, null, isLoggedIn, false)}<p>An error occurred while loading the page structure.</p>${generateFooter()}`);
    }
}

async function competitionUpdate(editable = false, req, res) {
    const uuid = req.params.uuid;
    const competitionName = req.query.competition;

    if (!competitionName) {
        return res.status(400).send('<p class="error p-4">Competition name is required.</p>');
    }

    const tournament = await getTournamentAndHandleErrors(uuid, res);
    if (!tournament) return;

    try {
        const competitionData = await getCompetitionData(tournament.id, competitionName);

        // Generate the HTML content using the combined data
        const content = generateCompetitionView(competitionData, editable, tournament.id);
        // Prepend the H1 title (using the actual competition name)
        const responseHtml = `${content}`;

        res.send(responseHtml);

    } catch (error) {
        console.log(error);
        console.error(`Error fetching/generating competition view for ${competitionName} in tournament ${uuid}:`, error.message);
        res.status(500).send(`<h1 class="error">${competitionName}</h1><p class="error p-4">Error loading data for ${competitionName}. Please try again later.</p>`);
    }
}
