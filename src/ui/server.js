const express = require('express');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const { apiRequest } = require('./api');
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

const app = express();
const PORT = 5421;

app.use('/styles', express.static(__dirname + '/styles'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(session({
    secret: 'your-secret-key', // Replace with a secure key in production
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

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
        const tournamentData = {
            title,
            date,
            location,
            ...(lat && { lat: parseFloat(lat) }),
            ...(lon && { lon: parseFloat(lon) }),
        };
        const response = await apiRequest('post', '/tournaments', tournamentData);
        const tournaments = await getTournaments();
        const content = generateTournamentSelection(tournaments, true);
        const html = `${generateHeader('Tournament Selection', null, null, null, true)}${content}${generateFooter()}`;
        res.send(html);
    } catch (error) {
        console.error('Error creating tournament:', error.message);
        const html = `${generateHeader('Error', null, null, null, true)}<p>Failed to create tournament: ${error.message}</p><a href="/" hx-get="/" hx-target="body" hx-swap="outerHTML">Back to Home</a>${generateFooter()}`;
        res.send(html);
    }
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
        const tournamentData = {
            title,
            date,
            location,
            ...(lat && { lat: parseFloat(lat) }), // Only include if provided
            ...(lon && { lon: parseFloat(lon) }),
        };
        console.log('Creating tournament with data:', tournamentData);
        const response = await apiRequest('post', '/tournaments', tournamentData);
        console.log('Tournament created:', response);
        // Redirect to refreshed tournament list
        const tournaments = await getTournaments();
        const content = generateTournamentSelection(tournaments, true);
        const html = `${generateHeader('Tournament Selection', null, null, null, true)}${content}${generateFooter()}`;
        res.send(html);
    } catch (error) {
        console.error('Error creating tournament:', error.message);
        const html = `${generateHeader('Error', null, null, null, true)}<p>Failed to create tournament: ${error.message}</p><a href="/" hx-get="/" hx-target="body" hx-swap="outerHTML">Back to Home</a>${generateFooter()}`;
        res.send(html);
    }
});

// Tournament selection page
app.get('/', async (req, res) => {
    try {
        const tournaments = await getTournaments();
        const isLoggedIn = !!req.session.user;
        if (tournaments.length === 0) {
            console.log('No tournaments found.');
            res.send(`${generateHeader('Tournament Selection', null, null, null, isLoggedIn)}No tournaments available.${generateFooter()}`);
            return;
        }
        const content = generateTournamentSelection(tournaments, isLoggedIn);
        console.log('Rendering tournament selection page.');
        const html = `${generateHeader('Tournament Selection', null, null, null, isLoggedIn)}${content}${generateFooter()}`;
        res.send(html);
    } catch (error) {
        console.error('Error fetching tournaments:', error.message);
        res.status(500).send('Server Error');
    }
});

// Planning area routes
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
        console.log(`Post-simulation matches: ${matches.length} items`);
        const content = generateMatchesPlanning({ tournamentId, matches });
        res.send(content);
    } catch (error) {
        console.error('Error simulating matches:', error.message);
        res.status(500).send('Simulation Error');
    }
});

// Execution area routes
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

app.get('/execution/:id/view5', async (req, res) => {
    const tournamentId = parseInt(req.params.id, 10);
    try {
        console.log(`Fetching carded players for tournament ${tournamentId}...`);
        const data = await getCardedPlayers(tournamentId);
        console.log(`Carded players: ${data.length} items`);
        const content = generateCardedPlayers(data);
        const html = `${generateHeader('Carded Players', tournamentId, 'execution', 'view5')}<div id="content" hx-get="/execution/${tournamentId}/view5-update" hx-trigger="every 30s" hx-swap="innerHTML">${content}</div>${generateFooter()}`;
        res.send(html);
    } catch (error) {
        console.error('Error in /execution/:id/view5:', error.message);
        res.status(500).send('Server Error');
    }
});

app.get('/execution/:id/view6', async (req, res) => {
    const tournamentId = parseInt(req.params.id, 10);
    try {
        console.log(`Fetching matches by pitch for tournament ${tournamentId}...`);
        const data = await getMatchesByPitch(tournamentId);
        console.log(`Matches by pitch: ${data.length} items`);
        const content = generateMatchesByPitch(data);
        const html = `${generateHeader('Matches by Pitch', tournamentId, 'execution', 'view6')}<div id="content" hx-get="/execution/${tournamentId}/view6-update" hx-trigger="every 30s" hx-swap="innerHTML">${content}</div>${generateFooter()}`;
        res.send(html);
    } catch (error) {
        console.error('Error in /execution/:id/view6:', error.message);
        res.status(500).send('Server Error');
    }
});

app.get('/execution/:id/view7', async (req, res) => {
    const tournamentId = parseInt(req.params.id, 10);
    try {
        console.log(`Fetching finals results for tournament ${tournamentId}...`);
        const data = await getFinalsResults(tournamentId);
        console.log(`Finals results: ${data.length} items`);
        const content = generateFinalsResults(data);
        const html = `${generateHeader('Finals Results', tournamentId, 'execution', 'view7')}<div id="content" hx-get="/execution/${tournamentId}/view7-update" hx-trigger="every 30s" hx-swap="innerHTML">${content}</div>${generateFooter()}`;
        res.send(html);
    } catch (error) {
        console.error('Error in /execution/:id/view7:', error.message);
        res.status(500).send('Server Error');
    }
});

// Partial update routes for execution
app.get('/execution/:id/recent-update', async (req, res) => {
    const tournamentId = parseInt(req.params.id, 10);
    try {
        console.log(`Fetching recent matches update for tournament ${tournamentId}...`);
        const { count, matches } = await getRecentMatches(tournamentId);
        res.send(generateRecentView(matches, count));
    } catch (error) {
        console.error('Error in /execution/:id/recent-update:', error.message);
        res.status(500).send('Server Error');
    }
});

app.get('/execution/:id/view2-update', async (req, res) => {
    const tournamentId = parseInt(req.params.id, 10);
    try {
        console.log(`Fetching group fixtures update for tournament ${tournamentId}...`);
        const data = await getGroupFixtures(tournamentId);
        res.send(generateGroupFixtures(data));
    } catch (error) {
        console.error('Error in /execution/:id/view2-update:', error.message);
        res.status(500).send('Server Error');
    }
});

app.get('/execution/:id/view3-update', async (req, res) => {
    const tournamentId = parseInt(req.params.id, 10);
    try {
        console.log(`Fetching group standings update for tournament ${tournamentId}...`);
        const data = await getGroupStandings(tournamentId);
        res.send(generateGroupStandings(data));
    } catch (error) {
        console.error('Error in /execution/:id/view3-update:', error.message);
        res.status(500).send('Server Error');
    }
});

app.get('/execution/:id/view4-update', async (req, res) => {
    const tournamentId = parseInt(req.params.id, 10);
    try {
        console.log(`Fetching knockout fixtures update for tournament ${tournamentId}...`);
        const data = await getKnockoutFixtures(tournamentId);
        res.send(generateKnockoutFixtures(data));
    } catch (error) {
        console.error('Error in /execution/:id/view4-update:', error.message);
        res.status(500).send('Server Error');
    }
});

app.get('/execution/:id/view5-update', async (req, res) => {
    const tournamentId = parseInt(req.params.id, 10);
    try {
        console.log(`Fetching carded players update for tournament ${tournamentId}...`);
        const data = await getCardedPlayers(tournamentId);
        res.send(generateCardedPlayers(data));
    } catch (error) {
        console.error('Error in /execution/:id/view5-update:', error.message);
        res.status(500).send('Server Error');
    }
});

app.get('/execution/:id/view6-update', async (req, res) => {
    const tournamentId = parseInt(req.params.id, 10);
    try {
        console.log(`Fetching matches by pitch update for tournament ${tournamentId}...`);
        const data = await getMatchesByPitch(tournamentId);
        res.send(generateMatchesByPitch(data));
    } catch (error) {
        console.error('Error in /execution/:id/view6-update:', error.message);
        res.status(500).send('Server Error');
    }
});

app.get('/execution/:id/view7-update', async (req, res) => {
    const tournamentId = parseInt(req.params.id, 10);
    try {
        console.log(`Fetching finals results update for tournament ${tournamentId}...`);
        const data = await getFinalsResults(tournamentId);
        res.send(generateFinalsResults(data));
    } catch (error) {
        console.error('Error in /execution/:id/view7-update:', error.message);
        res.status(500).send('Server Error');
    }
});

app.get('/planning/:id/reset', async (req, res) => {
    const tournamentId = parseInt(req.params.id, 10);
    try {
        console.log(`Resetting tournament ${tournamentId}...`);
        await apiRequest('post', `/tournaments/${tournamentId}/reset`); // Changed to POST per OpenAPI spec
        const matches = await getAllMatches(tournamentId);
        console.log(`Post-reset matches: ${matches.length} items`);
        const content = generateMatchesPlanning({ tournamentId, matches });
        res.send(content);
    } catch (error) {
        console.error('Error resetting tournament:', error.message);
        res.status(500).send('Reset Error');
    }
});

app.get('/planning/:id/import-fixtures', (req, res) => {
    const isLoggedIn = !!req.session.user;
    const tournamentId = parseInt(req.params.id, 10);
    if (!isLoggedIn) {
        const html = `${generateHeader('Access Denied', null, null, null, false)}<p>Please log in to import fixtures.</p><a href="/" hx-get="/" hx-target="body" hx-swap="outerHTML">Back to Home</a>${generateFooter()}`;
        res.send(html);
        return;
    }
    const html = `${generateHeader('Import Fixtures - Tournament ' + tournamentId, tournamentId, 'planning', null, true)}${generateImportFixtures(tournamentId)}${generateFooter()}`;
    res.send(html);
});

app.post('/planning/:id/import-fixtures', async (req, res) => {
    const isLoggedIn = !!req.session.user;
    const tournamentId = parseInt(req.params.id, 10);
    if (!isLoggedIn) {
        const html = `${generateHeader('Access Denied', null, null, null, false)}<p>Please log in to import fixtures.</p><a href="/" hx-get="/" hx-target="body" hx-swap="outerHTML">Back to Home</a>${generateFooter()}`;
        res.send(html);
        return;
    }

    if (!req.files || !req.files.file) {
        const html = `${generateHeader('Import Fixtures - Tournament ' + tournamentId, tournamentId, 'planning', null, true)}${generateImportFixtures(tournamentId)}<p style="color: red;">No file uploaded.</p>${generateFooter()}`;
        res.send(html);
        return;
    }

    try {
        const file = req.files.file;
        const csvContent = file.data.toString('utf8');
        const rows = csvRows(csvContent);
        const csvData = rows.map(row => ({
            matchId: row[0],
            startTime: row[1],
            pitch: row[2],
            stage: row[3],
            category: row[4],
            group: row[5],
            team1: row[6],
            team2: row[7],
            umpireTeam: row[8],
            duration: row[9],
        }));
        const html = `${generateHeader('Import Fixtures - Tournament ' + tournamentId, tournamentId, 'planning', null, true)}${generateImportFixtures(tournamentId, csvData)}${generateFooter()}`;
        res.send(html);
    } catch (error) {
        console.error('Error processing file:', error.message);
        const html = `${generateHeader('Import Fixtures - Tournament ' + tournamentId, tournamentId, 'planning', null, true)}${generateImportFixtures(tournamentId)}<p style="color: red;">Error processing file: ${error.message}</p>${generateFooter()}`;
        res.send(html);
    }
});

app.post('/planning/:id/check-import', async (req, res) => {
    const isLoggedIn = !!req.session.user;
    const tournamentId = parseInt(req.params.id, 10);
    if (!isLoggedIn) {
        const html = `${generateHeader('Access Denied', null, null, null, false)}<p>Please log in to import fixtures.</p><a href="/" hx-get="/" hx-target="body" hx-swap="outerHTML">Back to Home</a>${generateFooter()}`;
        res.send(html);
        return;
    }

    try {
        const { csvContent } = req.body;
        const csvData = JSON.parse(decodeURIComponent(csvContent));
        const { isValid, warnings } = validateFixtures(csvData);
        const html = `${generateHeader('Import Fixtures - Tournament ' + tournamentId, tournamentId, 'planning', null, true)}${generateImportFixtures(tournamentId, csvData, warnings)}${generateFooter()}`;
        res.send(html);
    } catch (error) {
        console.error('Error validating import:', error.message);
        const html = `${generateHeader('Import Fixtures - Tournament ' + tournamentId, tournamentId, 'planning', null, true)}${generateImportFixtures(tournamentId)}<p style="color: red;">Error validating import: ${error.message}</p>${generateFooter()}`;
        res.send(html);
    }
});

app.post('/planning/:id/import-fixtures', async (req, res) => {
    const isLoggedIn = !!req.session.user;
    const tournamentId = parseInt(req.params.id, 10);
    if (!isLoggedIn) {
        const html = `${generateHeader('Access Denied', null, null, null, false)}<p>Please log in to import fixtures.</p><a href="/" hx-get="/" hx-target="body" hx-swap="outerHTML">Back to Home</a>${generateFooter()}`;
        res.send(html);
        return;
    }

    if (!req.files || !req.files.file) {
        const html = `${generateHeader('Import Fixtures - Tournament ' + tournamentId, tournamentId, 'planning', null, true)}${generateImportFixtures(tournamentId)}<p style="color: red;">No file uploaded.</p>${generateFooter()}`;
        res.send(html);
        return;
    }

    try {
        const file = req.files.file;
        const csvContent = file.data.toString('utf8');
        const rows = csvRows(csvContent);
        const csvData = rows.map(row => ({
            matchId: row[0],
            startTime: row[1],
            pitch: row[2],
            stage: row[3],
            category: row[4],
            group: row[5],
            team1: row[6],
            team2: row[7],
            umpireTeam: row[8],
            duration: row[9],
        }));
        const html = `${generateHeader('Import Fixtures - Tournament ' + tournamentId, tournamentId, 'planning', null, true)}${generateImportFixtures(tournamentId, csvData)}${generateFooter()}`;
        res.send(html);
    } catch (error) {
        console.error('Error processing file:', error.message);
        const html = `${generateHeader('Import Fixtures - Tournament ' + tournamentId, tournamentId, 'planning', null, true)}${generateImportFixtures(tournamentId)}<p style="color: red;">Error processing file: ${error.message}</p>${generateFooter()}`;
        res.send(html);
    }
});


app.post('/planning/:id/validate-fixtures', async (req, res) => {
    const isLoggedIn = !!req.session.user;
    const tournamentId = parseInt(req.params.id, 10);
    if (!isLoggedIn) {
        const html = `${generateHeader('Access Denied', null, null, null, false)}<p>Please log in to import fixtures.</p><a href="/" hx-get="/" hx-target="body" hx-swap="outerHTML">Back to Home</a>${generateFooter()}`;
        res.send(html);
        return;
    }
    try {
        const { csvData: csvDataString } = req.body;
        const csvData = JSON.parse(decodeURIComponent(csvDataString));
        const validationResult = validateFixtures(csvData);
        const html = `${generateHeader('Import Fixtures - Tournament ' + tournamentId, tournamentId, 'planning', null, true)}${generateImportFixtures(tournamentId, csvData, validationResult)}${generateFooter()}`;
        res.send(html);
    } catch (error) {
        console.error('Error validating fixtures:', error.message);
        const html = `${generateHeader('Import Fixtures - Tournament ' + tournamentId, tournamentId, 'planning', null, true)}${generateImportFixtures(tournamentId)}<p style="color: red;">Error validating fixtures: ${error.message}</p>${generateFooter()}`;
        res.send(html);
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await loginUser(email, password);
        if (user) {
            req.session.user = { id: user.id, name: user.Name, email: user.email };
            const html = `${generateHeader('Home', null, null, null, true)}<p>Logged in successfully as ${user.Name}.</p>${generateFooter()}`;
            res.send(html);
        } else {
            const html = `${generateHeader('Log In Failed')}<p>Invalid email or password.</p><a href="/" hx-get="/" hx-target="body" hx-swap="outerHTML">Back to Home</a>${generateFooter()}`;
            res.send(html);
        }
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).send('Server Error');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Logout Error');
        } else {
            const html = `${generateHeader('Logged Out')}<p>You have been logged out.</p><a href="/" hx-get="/" hx-target="body" hx-swap="outerHTML">Back to Home</a>${generateFooter()}`;
            res.send(html);
        }
    });
});

app.get('/request-access', (req, res) => {
    console.log('Rendering request-access page...');
    const html = `
        ${generateHeader('Request Access')}
        <div id="request-access">
            <h2>Request Access</h2>
            <p>Please contact the administrator to request access.</p>
            <a href="/" hx-get="/" hx-target="body" hx-swap="outerHTML">Back to Home</a>
        </div>
        ${generateFooter()}
    `;
    res.send(html);
});

app.post('/planning/:id/confirm-import', async (req, res) => {
    const isLoggedIn = !!req.session.user;
    const tournamentId = parseInt(req.params.id, 10);
    if (!isLoggedIn) {
        const html = `${generateHeader('Access Denied', null, null, null, false)}<p>Please log in to import fixtures.</p><a href="/" hx-get="/" hx-target="body" hx-swap="outerHTML">Back to Home</a>${generateFooter()}`;
        res.send(html);
        return;
    }

    const { csvData: csvDataString } = req.body;
    let csvData; 
    try {
        csvData = JSON.parse(decodeURIComponent(csvDataString));
        console.log('Parsed csvData for import:', csvData);
        const tournamentResponse = await apiRequest('get', `/tournaments/${tournamentId}`);
        const { Date: startDate, Title: title, Location: location } = tournamentResponse.data;
        const importData = {
            tournamentId,
            startDate,
            title,
            location,
            pinCode: 'default',
            activities: csvData,
        };
        await generateFixturesImport(importData);
        const matches = await getAllMatches(tournamentId);
        const content = generateMatchesPlanning({ tournamentId, matches });
        const html = `${generateHeader('Planning - Tournament ' + tournamentId, tournamentId, 'planning', null, true)}${content}${generateFooter()}`;
        res.send(html);
    } catch (error) {
        console.error('Error confirming import:', error.message);
        const html = `${generateHeader('Import Fixtures - Tournament ' + tournamentId, tournamentId, 'planning', null, true)}${generateImportFixtures(tournamentId, csvData || [])}<p style="color: red;">Error importing fixtures: ${error.message}</p>${generateFooter()}`;
        res.send(html);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}. Visit http://localhost:${PORT} to select a tournament.`);
});
