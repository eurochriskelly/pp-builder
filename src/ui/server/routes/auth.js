const express = require('express');
const { loginUser } = require('../../queries/auth'); // Fixed path
const generateHeader = require('../../templates/header');
const generateFooter = require('../../templates/footer');
const generateLoginForm = require('../../templates/views/loginForm'); // Import the new form template
const generateTournamentSelection = require('../../templates/views/tournamentSelection');
const { getTournaments } = require('../../../../dist/src/simulation/retrieve');

const router = express.Router();

// GET route to display the login form
router.get('/login', (req, res) => {
    const header = generateHeader('Login', null, null, null, false);
    const footer = generateFooter();
    const form = generateLoginForm();
    res.send(`${header}${form}${footer}`);
});

// POST route to handle login submission
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await loginUser(email, password);
        if (!user) {
            const html = `${generateHeader('Login Failed', null, null, null, false)}<p>Invalid email or password.</p><a href="/" hx-get="/" hx-target="body" hx-swap="outerHTML">Back to Home</a>${generateFooter()}`;
            res.status(401).send(html);
            return;
        }
        req.session.user = user;
        const tournaments = await getTournaments();
        const content = generateTournamentSelection(tournaments, true, `${req.protocol}://${req.get('host')}`);
        const html = `${generateHeader('Tournament Selection', null, null, null, true)}${content}${generateFooter()}`;
        // Add HX-Push-Url header to update the browser's URL to '/' after successful login
        res.setHeader('HX-Push-Url', '/');
        res.send(html);
    } catch (error) {
        console.error('Error during login:', error.message);
        const html = `${generateHeader('Login Error', null, null, null, false)}<p>An error occurred during login.</p><a href="/" hx-get="/" hx-target="body" hx-swap="outerHTML">Back to Home</a>${generateFooter()}`;
        res.status(500).send(html);
    }
});

// GET route to handle logout
router.get('/logout', (req, res) => {
    req.session.destroy(async (err) => { // Use async here to await getTournaments
        if (err) {
            console.error('Error destroying session:', err);
            // Optionally send an error page or redirect
            const html = `${generateHeader('Logout Error', null, null, null, false)}<p>An error occurred during logout.</p><a href="/" hx-get="/" hx-target="body" hx-swap="outerHTML">Back to Home</a>${generateFooter()}`;
            return res.status(500).send(html);
        }
        try {
            // Fetch tournaments again to display the home page after logout
            const tournaments = await getTournaments();
            // Render the tournament selection page, explicitly setting isLoggedIn to false
            const content = generateTournamentSelection(tournaments, false, `${req.protocol}://${req.get('host')}`);
            const header = generateHeader('Tournament Selection', null, null, null, false); // Ensure header shows logged-out state
            const footer = generateFooter();
            res.send(`${header}${content}${footer}`);
        } catch (error) {
            console.error('Error fetching tournaments after logout:', error.message);
            const html = `${generateHeader('Logout Error', null, null, null, false)}<p>An error occurred after logging out.</p><a href="/" hx-get="/" hx-target="body" hx-swap="outerHTML">Back to Home</a>${generateFooter()}`;
            res.status(500).send(html);
        }
    });
});

module.exports = router;
