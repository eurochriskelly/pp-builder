const express = require('express');
const { apiRequest, getRecentMatches, getGroupFixtures } = require('../queries');
const generateHeader = require('../templates/header');
const generateFooter = require('../templates/footer');
const generateRecentView = require('../templates/views/execution/recent');
const generateGroupFixtures = require('../templates/views/execution/groupFixtures');
const generateEventManager = require('../templates/eventManager');

const router = express.Router();

router.get('/event/:uuid', async (req, res) => {
    const uuid = req.params.uuid;
    try {
        const tournament = await apiRequest('get', `/tournaments/by-uuid/${uuid}`);
        if (!tournament || !tournament.id) {
            const html = `${generateHeader('Not Found', null, null, null, false)}<p>Tournament not found for UUID: ${uuid}</p>${generateFooter()}`;
            res.status(404).send(html);
            return;
        }
        const tournamentId = tournament.id;
        const { count, matches } = await getRecentMatches(tournamentId);
        const content = generateRecentView(matches, count);
        const html = `${generateHeader('Tournament Status', tournamentId, 'execution', 'recent', false)}<div id="content" hx-get="/event/${uuid}/recent-update" hx-trigger="every 30s" hx-swap="innerHTML">${content}</div>${generateEventManager(tournamentId, uuid)}${generateFooter()}`;
        res.send(html);
    } catch (error) {
        console.error('Error in /event/:uuid:', error.message);
        res.status(500).send('Server Error');
    }
});

router.get('/event/:uuid/:view', async (req, res) => {
    const uuid = req.params.uuid;
    const view = req.params.view;
    try {
        const tournament = await apiRequest('get', `/tournaments/by-uuid/${uuid}`);
        if (!tournament || !tournament.id) {
            const html = `${generateHeader('Not Found', null, null, null, false)}<p>Tournament not found for UUID: ${uuid}</p>${generateFooter()}`;
            res.status(404).send(html);
            return;
        }
        const tournamentId = tournament.id;

        const allowedViews = {
            'recent': { generator: generateRecentView, fetch: getRecentMatches, title: 'Recent Matches' },
            'view2': { generator: generateGroupFixtures, fetch: getGroupFixtures, title: 'Group Fixtures' },
        };

        if (!allowedViews[view]) {
            const html = `${generateHeader('Not Allowed', tournamentId, 'execution', null, false)}<p>View not accessible via public URL.</p>${generateEventManager(tournamentId, uuid)}${generateFooter()}`;
            res.status(403).send(html);
            return;
        }

        const { generator, fetch, title } = allowedViews[view];
        const data = await fetch(tournamentId);
        const content = view === 'recent' ? generator(data.matches, data.count) : generator(data);
        const html = `${generateHeader(title, tournamentId, 'execution', view, false)}<div id="content" hx-get="/event/${uuid}/${view}-update" hx-trigger="every 30s" hx-swap="innerHTML">${content}</div>${generateEventManager(tournamentId, uuid)}${generateFooter()}`;
        res.send(html);
    } catch (error) {
        console.error(`Error in /event/:uuid/${view}:`, error.message);
        res.status(500).send('Server Error');
    }
});

Object.keys({
    'recent': getRecentMatches,
    'view2': getGroupFixtures,
}).forEach(view => {
    router.get(`/event/:uuid/${view}-update`, async (req, res) => {
        const uuid = req.params.uuid;
        try {
            const tournament = await apiRequest('get', `/tournaments/by-uuid/${uuid}`);
            if (!tournament || !tournament.id) {
                res.status(404).send('<p>Tournament not found.</p>');
                return;
            }
            const tournamentId = tournament.id;
            const fetch = view === 'recent' ? getRecentMatches : getGroupFixtures;
            const generator = view === 'recent' ? generateRecentView : generateGroupFixtures;
            const data = await fetch(tournamentId);
            const content = view === 'recent' ? generator(data.matches, data.count) : generator(data);
            res.send(content);
        } catch (error) {
            console.error(`Error in /event/:uuid/${view}-update:`, error.message);
            res.status(500).send('Server Error');
        }
    });
});

module.exports = router;
