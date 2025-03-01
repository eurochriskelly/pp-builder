const express = require('express');
const { getAllMatches } = require('../queries');
const { play } = require('../../../dist/src/simulation');
const generateHeader = require('../templates/header');
const generateFooter = require('../templates/footer');
const generateMatchesPlanning = require('../templates/views/planning/matches');

const router = express.Router();

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

module.exports = router;
