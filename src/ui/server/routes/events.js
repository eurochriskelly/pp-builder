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
          <style>
            @media (max-width: 999px) {
              #event-manager table { display: block; width: 100%; }
              #event-manager table tr { display: block; margin-bottom: 10px; }
            }
          </style>
          <p>View not accessible via public URL.</p>
          ${generateEventManager(tournamentId, uuid, tournament, isLoggedIn)}
        }`;
        return res.status(403).send(html);
    }
    const { generator, fetch, title } = allowedViews[view];
    const data = await fetch(tournamentId);
    const isLoggedIn = !!req.session.user;
    const content = view === 'recent' ? generator(data.matches, data.count) : generator(data); // Handle 'recent' special case
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
});

Object.keys(allowedViews).forEach(view => {
    router.get(`/event/:uuid/${view}-update`, async (req, res) => {
        const uuid = req.params.uuid;
        const tournament = await getTournamentAndHandleErrors(uuid, res);
        if (!tournament) return;

        const tournamentId = tournament.id;
        const { fetch, generator } = allowedViews[view];
        const data = await fetch(tournamentId);
        const content = view === 'recent' ? generator(data.matches, data.count) : generator(data);
        res.send(content);
    });
});

module.exports = router;
