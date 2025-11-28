const express = require('express');
const { getTournaments } = require('../../../../dist/src/simulation/retrieve');
const { createTournament } = require('../queries/tournaments');
const { loginUser } = require('../queries/auth');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Auth endpoints
router.get('/auth/me', (req, res) => {
    if (req.session.user) {
        res.json({ user: req.session.user });
    } else {
        res.status(401).json({ user: null });
    }
});

router.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Try to authenticate via the REST API backend
        let user = await loginUser(email, password);

        // If REST API is unavailable, use a simple fallback for development
        if (!user && process.env.NODE_ENV !== 'production') {
            console.warn('REST API unavailable, using fallback authentication');
            // Simple mock authentication for development
            if (email && password) {
                user = {
                    id: 1,
                    name: email.split('@')[0],
                    email: email
                };
            }
        }

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        req.session.user = user;
        res.json({ user });
    } catch (error) {
        console.error('API: Error during login:', error.message);

        // Fallback for development if REST API is down
        if (process.env.NODE_ENV !== 'production') {
            console.warn('Using fallback authentication due to error');
            const user = {
                id: 1,
                name: req.body.email ? req.body.email.split('@')[0] : 'TestUser',
                email: req.body.email || 'test@example.com'
            };
            req.session.user = user;
            return res.json({ user });
        }

        res.status(500).json({ error: 'Login failed: ' + error.message });
    }
});

router.post('/auth/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('API: Error destroying session:', err);
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ message: 'Logged out successfully' });
    });
});

// Tournament endpoints
router.get('/tournaments', async (req, res) => {
    try {
        console.log('API: Fetching tournaments...');
        const tournaments = await getTournaments();
        res.json(tournaments);
    } catch (error) {
        console.error('API: Error fetching tournaments:', error.message);
        res.status(500).json({ error: error.message });
    }
});

router.post('/tournaments', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const { title, date, location, lat, lon } = req.body;
    try {
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
        res.status(201).json({ message: 'Tournament created', data: tournamentData });
    } catch (error) {
        console.error('API: Error creating tournament:', error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
