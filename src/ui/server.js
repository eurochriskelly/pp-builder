const express = require('express');
const { executeQuery } = require('./db');
const { processTeamName, formatScore } = require('./utils');
const generateHeader = require('./templates/header');
const generateFooter = require('./templates/footer');
const generateRecentView = require('./templates/views/recent');

const app = express();
const PORT = 5421;
const TOURNAMENT_ID = process.argv[2] ? parseInt(process.argv[2], 10) : 16;

app.use('/styles', express.static(__dirname + '/styles'));

app.get('/', async (req, res) => {
    try {
        const query1 = `
            SELECT count(*) as count 
            FROM EuroTourno.v_fixture_information 
            WHERE tournamentId = ? AND goals1 IS NOT NULL;
        `;
        const query2 = `
            SELECT 
                id,
                DATE_FORMAT(DATE_ADD(started, INTERVAL 2 HOUR), '%H:%i') as start,
                pitch,
                groupNumber as grp,
                stage,
                category as competition,
                team1,
                CONCAT(goals1, '-', LPAD(points1, 2, '0'), ' (', LPAD(IF(goals1 IS NOT NULL AND points1 IS NOT NULL, goals1 * 3 + points1, 'N/A'), 2, '0'), ')') AS score1,
                team2,
                CONCAT(goals2, '-', LPAD(points2, 2, '0'), ' (', LPAD(IF(goals2 IS NOT NULL AND points2 IS NOT NULL, goals2 * 3 + points2, 'N/A'), 2, '0'), ')') AS score2,
                umpireTeam
            FROM EuroTourno.v_fixture_information 
            WHERE tournamentId = ? AND started IS NOT NULL 
            ORDER BY started DESC
            LIMIT 12
        `;
        const [results1, results2] = await Promise.all([
            executeQuery(query1, [TOURNAMENT_ID]),
            executeQuery(query2, [TOURNAMENT_ID])
        ]);
        const html = generateHeader('Tournament Status Page') + generateRecentView(results2, results1[0].count) + generateFooter();
        res.send(html);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server Error');
    }
});

// Add other routes (view2, view3, etc.) similarly

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} for Tournament ID ${TOURNAMENT_ID}`);
});
