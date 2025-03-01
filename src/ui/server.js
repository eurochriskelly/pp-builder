const express = require('express');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const { apiRequest, setApiBaseUrl } = require('./api');
const { processTeamName, formatScore } = require('./utils');
const {
    getRecentMatches,
    getGroupFixtures,
    getGroupStandings,
    getKnockoutFixtures,
    getCardedPlayers,
    getMatchesByPitch,
    getFinalsResults,
    getAllMatches,
    loginUser,
} = require('./queries');
const { getTournaments } = require('../../dist/src/simulation/retrieve');
const { csvRows } = require('../../dist/src/import');
const { generateFixturesImport } = require('../../dist/src/import');
const { validateFixtures } = require('../../dist/src/import/validate');
const { play } = require('../../dist/src/simulation');
const generateHeader = require('./templates/header');
const generateFooter = require('./templates/footer');
const generateTournamentSelection = require('./templates/views/tournamentSelection');
const generateRecentView = require('./templates/views/execution/recent');
const generateGroupFixtures = require('./templates/views/execution/groupFixtures');
const generateGroupStandings = require('./templates/views/execution/groupStandings');
const generateKnockoutFixtures = require('./templates/views/execution/knockoutFixtures');
const generateCardedPlayers = require('./templates/views/execution/cardedPlayers');
const generateMatchesByPitch = require('./templates/views/execution/matchesByPitch');
const generateFinalsResults = require('./templates/views/execution/finalsResults');
const generateMatchesPlanning = require('./templates/views/planning/matches');
const generateCreateTournament = require('./templates/views/createTournament');
const generateImportFixtures = require('./templates/views/importFixtures');
const generateEventManager = require('./templates/views/execution/eventManager');

function startServer(port, restPort, restHost, bypassAuth) {
    const FRONTEND_PORT = port;
    const REST_PORT = restPort;
    const REST_HOST = restHost;
    const BYPASS_AUTH = bypassAuth;

    console.log('Server starting with:');
    console.log('FRONTEND_PORT:', FRONTEND_PORT);
    console.log('REST_PORT:', REST_PORT);
    console.log('REST_HOST:', REST_HOST);
    console.log('BYPASS_AUTH:', BYPASS_AUTH);

    const API_BASE_URL = `http://${REST_HOST}:${REST_PORT}/api`;
    console.log('API_BASE_URL set to:', API_BASE_URL);
    setApiBaseUrl(API_BASE_URL);

    const app = express();

    app.use('/styles', express.static(__dirname + '/styles'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(fileUpload());
    app.use(session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }
    }));

    if (BYPASS_AUTH) {
        app.use((req, res, next) => {
            req.session.user = { id: 1, name: 'TestUser', email: 'test@example.com' };
            next();
        });
    }

    app.get('/create-tournament', (req, res) => {
        const isLoggedIn = !!req.session.user;
        if (!isLoggedIn) {
            const html = `${generateHeader('Access Denied', null, null, null, false)}<p>Please log in to create a tournament.</p><a href="/" hx-get="/" hx-target="body" hx-swap="outerHTML">Back to Home</a>${generateFooter()}`;
            res.send(html);
            return;
        }
        const html = `${generateHeader('Create Tournament', null, null, null, true)}${generateCreateTournament()}${generateFooter()}`;
        res.send(html);
    });

    app.post('/create-tournament', async (req, res) => {
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

    app.get('/', async (req, res) => {
        try {
            console.log('Fetching tournaments for root route...');
            const tournaments = await getTournaments();
            console.log('Tournament # received:', tournaments.length);
            const isLoggedIn = !!req.session.user || BYPASS_AUTH;
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

    app.get('/planning/:id', async (req, res) => {
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

    app.post('/planning/:id/simulate/:count', async (req, res) => {
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

    app.get('/execution/:id/recent', async (req, res) => {
        const tournamentId = parseInt(req.params.id, 10);
        try {
            console.log(`Fetching recent matches for tournament ${tournamentId}...`);
            const { count, matches } = await getRecentMatches(tournamentId);
            console.log(`Recent matches: ${matches.length} items, total count: ${count}`);
            const content = generateRecentView(matches, count);
            const html = `${generateHeader('Tournament Status', tournamentId, 'execution', 'recent')}<div id="content" hx-get="/execution/${tournamentId}/recent-update" hx-trigger="every 30s" hx-swap="innerHTML">${content}</div>${generateFooter()}`;
            res.send(html);
        } catch (error) {
            console.error('Error in /execution/:id/recent:', error.message);
            res.status(500).send('Server Error');
        }
    });

    app.get('/execution/:id/view2', async (req, res) => {
        const tournamentId = parseInt(req.params.id, 10);
        try {
            console.log(`Fetching group fixtures for tournament ${tournamentId}...`);
            const data = await getGroupFixtures(tournamentId);
            console.log(`Group fixtures: ${data.length} items`);
            const content = generateGroupFixtures(data);
            const html = `${generateHeader('Group Fixtures', tournamentId, 'execution', 'view2')}<div id="content" hx-get="/execution/${tournamentId}/view2-update" hx-trigger="every 30s" hx-swap="innerHTML">${content}</div>${generateFooter()}`;
            res.send(html);
        } catch (error) {
            console.error('Error in /execution/:id/view2:', error.message);
            res.status(500).send('Server Error');
        }
    });

    app.get('/execution/:id/view3', async (req, res) => {
        const tournamentId = parseInt(req.params.id, 10);
        try {
            console.log(`Fetching group standings for tournament ${tournamentId}...`);
            const data = await getGroupStandings(tournamentId);
            console.log(`Group standings categories: ${Object.keys(data).length}`);
            const content = generateGroupStandings(data);
            const html = `${generateHeader('Group Standings', tournamentId, 'execution', 'view3')}<div id="content" hx-get="/execution/${tournamentId}/view3-update" hx-trigger="every 30s" hx-swap="innerHTML">${content}</div>${generateFooter()}`;
            res.send(html);
        } catch (error) {
            console.error('Error in /execution/:id/view3:', error.message);
            res.status(500).send('Server Error');
        }
    });

    app.get('/execution/:id/view4', async (req, res) => {
        const tournamentId = parseInt(req.params.id, 10);
        try {
            console.log(`Fetching knockout fixtures for tournament ${tournamentId}...`);
            const data = await getKnockoutFixtures(tournamentId);
            console.log(`Knockout fixtures: ${data.length} items`);
            const content = generateKnockoutFixtures(data);
            const html = `${generateHeader('Knockout Fixtures', tournamentId, 'execution', 'view4')}<div id="content" hx-get="/execution/${tournamentId}/view4-update" hx-trigger="every 30s" hx-swap="innerHTML">${content}</div>${generateFooter()}`;
            res.send(html);
        } catch (error) {
            console.error('Error in /execution/:id/view4:', error.message);
            res.status(500).send('Server Error');
        }
    });

    app.get('/event/:uuid', async (req, res) => {
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

    app.get('/event/:uuid/:view', async (req, res) => {
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
        app.get(`/event/:uuid/${view}-update`, async (req, res) => {
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

    console.log('Starting server on port:', FRONTEND_PORT);
    const server = app.listen(FRONTEND_PORT, () => {
        console.log(`Server running on port ${FRONTEND_PORT}`);
    });

    process.on('SIGTERM', shutDown);
    process.on('SIGINT', shutDown);

    function shutDown() {
        console.log('Received shutdown signal, closing server...');
        server.close(() => {
            console.log('Server closed.');
            process.exit(0);
        });
        setTimeout(() => {
            console.error('Forcing shutdown.');
            process.exit(1);
        }, 5000);
    }
}

module.exports = { startServer };
