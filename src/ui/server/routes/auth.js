const express = require('express');
const { loginUser } = require('../../queries/auth'); // Fixed path
const generateHeader = require('../../templates/header');
const generateFooter = require('../../templates/footer');
const generateTournamentSelection = require('../../templates/views/tournamentSelection');
const { getTournaments } = require('../../../../dist/src/simulation/retrieve');

const router = express.Router();

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
        res.send(html);
    } catch (error) {
        console.error('Error during login:', error.message);
        const html = `${generateHeader('Login Error', null, null, null, false)}<p>An error occurred during login.</p><a href="/" hx-get="/" hx-target="body" hx-swap="outerHTML">Back to Home</a>${generateFooter()}`;
        res.status(500).send(html);
    }
});

module.exports = router;
