const express = require('express');
const { createTournament } = require('../queries/tournaments'); // Fixed path
const generateHeader = require('../../templates/header');
const generateFooter = require('../../templates/footer');
const generateTournamentSelection = require('../../templates/views/tournamentSelection/index');
const generateCreateTournament = require('../../templates/views/createTournament');
const { getTournaments } = require('../../../../dist/src/simulation/retrieve');

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

// Route to get just the form fragment for the modal
router.get('/create-tournament-form', (req, res) => {
    const isLoggedIn = !!req.session.user;
    if (!isLoggedIn) {
        // Send an empty response or an error message if accessed directly without login
        return res.status(403).send('<p class="text-red-500 p-4">Access Denied. Please log in.</p>');
    }
    // Return only the form HTML, no header/footer
    res.send(generateCreateTournament());
});


// Original route for potentially accessing the create form directly (though now modal is preferred)
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
        await createTournament(tournamentData);

        // Check if the request came from HTMX
        if (req.headers['hx-request']) {
            // If yes, trigger a full page refresh on the client side
            res.set('HX-Refresh', 'true');
            res.status(200).send(); // Send an empty response as the refresh handles the update
        } else {
            // Fallback for non-HTMX requests (e.g., direct form submission if JS fails)
            const tournaments = await getTournaments();
            const content = generateTournamentSelection(tournaments, true, `${req.protocol}://${req.get('host')}`);
            const html = `${generateHeader('Tournament Selection', null, null, null, true)}${content}${generateFooter()}`;
            res.send(html);
        }
    } catch (error) {
        console.error('Error creating tournament:', error.message);
        // Handle error response for both HTMX and regular requests
        const errorHtml = `<p class="text-red-500 p-4">Failed to create tournament: ${error.message}</p><button type="button" onclick="document.getElementById('create-tournament-modal').style.display='none'; document.getElementById('create-tournament-modal-content').innerHTML='';">Close</button>`;
        if (req.headers['hx-request']) {
             // Send error message back to the modal
            res.status(500).send(errorHtml);
        } else {
            const html = `${generateHeader('Error', null, null, null, true)}${errorHtml}<a href="/" hx-get="/" hx-target="body" hx-swap="outerHTML">Back to Home</a>${generateFooter()}`;
            res.status(500).send(html);
        }
        const html = `${generateHeader('Error', null, null, null, true)}<p>Failed to create tournament: ${error.message}</p><a href="/" hx-get="/" hx-target="body" hx-swap="outerHTML">Back to Home</a>${generateFooter()}`;
        res.send(html);
    }
});

module.exports = router;
