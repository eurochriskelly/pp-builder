const express = require('express');
const { apiRequest } = require('../api');
const generateHeader = require('../templates/header');
const generateFooter = require('../templates/footer');
const generateTournamentSelection = require('../templates/views/tournamentSelection');
const generateCreateTournament = require('../templates/views/createTournament');
const { getTournaments } = require('../../../dist/src/simulation/retrieve');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        console.log('Fetching tournaments for root route...');
        const tournaments = await getTournaments();
        console.log('Tournament # received:', tournaments.length);
        const isLoggedIn = !!req.session.user;
        if (tournaments.length === 0) {
            console.log('No tournaments found.');
            res.send(`${generateHeader('Tournament Selection', null, null, null, isLoggedIn)}No tournaments available.${generateFooter()}`);
            return;
        }
        const frontendBaseUrl = `${req.protocol}://${req.get('host')}`;
        const content = generateTournamentSelection(tournaments, isLoggedIn, frontendBaseUrl);
        console.log('Rendering tournament selection page.');
        const html = `${generateHeader('Tournament Selection', null, null, null, isLoggedIn)}${content}${generateFooter()}`;
        res.send(html);
    } catch (error) {
        console.error('Error fetching tournaments:', error.message);
        res.status(500).send('Server Error');
    }
});

router.get('/create-tournament', (req, res) => {
    const isLoggedIn = !!req.session.user;
    if (!isLoggedIn) {
        const html = `${generateHeader('Access Denied', null, null, null, false)}<p>Please log in to create a tournament.</p><a href="/" hx-get="/" hx-target="body" hx-swap="outerHTML">Back to Home</a>${generateFooter()}`;
        res.send(html);
        return;
    }
    const html = `${generateHeader('Create Tournament', null, null, null, true)}${generateCreateTournament()}${generateFooter()}`;
    res.send(html);
});

router.post('/create-tournament', async (req, res) => {
    const isLoggedIn = !!req.session.user;
    if (!isLoggedIn) {
        const html = `${generateHeader('Access Denied', null, null, null, false)}<p>Please log in to create a tournament.</p><a href="/" hx-get="/" hx-target="body" hx-swap="outerHTML">Back to Home</a>${generateFooter()}`;
        res.send(html);
        return;
    }
    const { title, date, location, lat, lon } = req.body;
    try {
        const { v4: uuidv4 } = require('uuid');
        const eventUuid = uuidv4();
        const tournamentData = {
            title,
            date,
            location,
            eventUuid,
            ...(lat && { lat: parseFloat(lat) }),
            ...(lon && { lon: parseFloat(lon) }),
        };
        const response = await apiRequest('post', '/tournaments', tournamentData);
        const tournaments = await getTournaments();
        const content = generateTournamentSelection(tournaments, true, `${req.protocol}://${req.get('host')}`);
        const html = `${generateHeader('Tournament Selection', null, null, null, true)}${content}${generateFooter()}`;
        res.send(html);
    } catch (error) {
        console.error('Error creating tournament:', error.message);
        const html = `${generateHeader('Error', null, null, null, true)}<p>Failed to create tournament: ${error.message}</p><a href="/" hx-get="/" hx-target="body" hx-swap="outerHTML">Back to Home</a>${generateFooter()}`;
        res.send(html);
    }
});

module.exports = router;

