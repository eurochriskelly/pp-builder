const { executeQuery } = require('./db');

async function getRecentMatches(tournamentId) {
    const queryCount = `
        SELECT count(*) as count 
        FROM EuroTourno.v_fixture_information 
        WHERE tournamentId = ? AND goals1 IS NOT NULL;
    `;
    const queryMatches = `
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
    const [countResult, matchesResult] = await Promise.all([
        executeQuery(queryCount, [tournamentId]),
        executeQuery(queryMatches, [tournamentId])
    ]);
    return {
        count: countResult[0].count,
        matches: matchesResult
    };
}

async function getGroupFixtures(tournamentId) {
    const query = `
        SELECT 
            id,
            category,
            groupNumber AS g,
            pitch,
            scheduledTime,
            team1,
            goals1,
            points1,
            team2,
            goals2,
            points2,
            umpireTeam,
            IF(started IS NULL, 'false', 'true') AS started
        FROM EuroTourno.v_fixture_information
        WHERE tournamentId = ? AND stage = 'group'
        ORDER BY category, scheduledTime;
    `;
    return await executeQuery(query, [tournamentId]);
}

async function getGroupStandings(tournamentId) {
    const queryGroups = `
        SELECT DISTINCT grp as gnum, category
        FROM EuroTourno.v_group_standings
        WHERE tournamentId = ?;
    `;
    const groups = await executeQuery(queryGroups, [tournamentId]);
    const byCategory = groupGnums(groups);

    let dataCollection = {};
    for (const cat of Object.keys(byCategory)) {
        dataCollection[cat] = [];
        const groupList = byCategory[cat].sort();
        let lastGrp = '';

        for (const grp of groupList) {
            const query = `
                SELECT 
                    category,
                    grp,
                    team,
                    tournamentId,
                    MatchesPlayed,
                    Wins,
                    Draws,
                    Losses,
                    PointsFrom,
                    PointsDifference,
                    TotalPoints
                FROM EuroTourno.v_group_standings
                WHERE tournamentId = ? AND category = '${cat}' AND grp LIKE '${grp}'
                ORDER BY TotalPoints DESC, PointsDifference DESC, PointsFrom DESC;
            `;
            const results = await executeQuery(query, [tournamentId]);

            const isNewGroup = () => {
                let newgrp = true;
                if (grp.includes('__')) {
                    if (lastGrp.startsWith('__') && grp.startsWith('__')) newgrp = false;
                    if (lastGrp.endsWith('__') && grp.endsWith('__')) newgrp = false;
                }
                return newgrp;
            };

            if (isNewGroup()) {
                dataCollection[cat].push({
                    groupName: grp.includes('__') ? `${grp}`.replace(/_/g, '').substring(0, 1) : grp,
                    rows: []
                });
            }

            const currentGroup = dataCollection[cat][dataCollection[cat].length - 1];

            if (grp.includes('__')) {
                const teamCounts = {};
                for (const row of results) {
                    const team = row.team || 'N/A';
                    teamCounts[team] = (teamCounts[team] || 0) + 1;
                }
                let duplicateTeam = null;
                for (const team in teamCounts) {
                    if (teamCounts[team] > 1) {
                        duplicateTeam = team;
                        break;
                    }
                }
                const duplicateTeamRows = results.filter(row => (row.team || 'N/A') === duplicateTeam);
                const summedRow = {
                    team: duplicateTeam,
                    MatchesPlayed: 0,
                    Wins: 0,
                    Draws: 0,
                    Losses: 0,
                    PointsFrom: 0,
                    PointsDifference: 0,
                    TotalPoints: 0
                };
                for (const row of duplicateTeamRows) {
                    summedRow.MatchesPlayed += parseInt(row.MatchesPlayed) || 0;
                    summedRow.Wins += parseInt(row.Wins) || 0;
                    summedRow.Draws += parseInt(row.Draws) || 0;
                    summedRow.Losses += parseInt(row.Losses) || 0;
                    summedRow.PointsFrom += parseInt(row.PointsFrom) || 0;
                    summedRow.PointsDifference += parseInt(row.PointsDifference) || 0;
                    summedRow.TotalPoints += parseInt(row.TotalPoints) || 0;
                }
                currentGroup.rows.push(summedRow);
            } else {
                for (const row of results) {
                    currentGroup.rows.push({
                        team: row.team || 'N/A',
                        MatchesPlayed: row.MatchesPlayed || '0',
                        Wins: row.Wins || '0',
                        Draws: row.Draws || '0',
                        Losses: row.Losses || '0',
                        PointsFrom: row.PointsFrom || '0',
                        PointsDifference: row.PointsDifference || '0',
                        TotalPoints: row.TotalPoints || '0'
                    });
                }
            }
            lastGrp = grp;
        }
    }
    return dataCollection;
}

function groupGnums(data) {
    const result = {};
    data.forEach(item => {
        const { gnum, category } = item;
        if (!result[category]) {
            result[category] = new Set();
        }
        if (gnum < 1000) {
            result[category].add(gnum.toString());
        } else {
            const gnumStr = gnum.toString().padStart(4, '0');
            const startPattern = `${gnumStr.slice(0, 2)}__`;
            const endPattern = `__${gnumStr.slice(2, 4)}`;
            result[category].add(startPattern);
            result[category].add(endPattern);
        }
    });
    for (const category in result) {
        result[category] = Array.from(result[category]);
    }
    return result;
}

async function getKnockoutFixtures(tournamentId) {
    const query = `
        SELECT 
            id,
            category,
            stage,
            pitch,
            scheduledTime,
            team1,
            goals1,
            points1,
            team2,
            goals2,
            points2,
            umpireTeam,
            IF(started IS NULL, 'false', 'true') AS started
        FROM EuroTourno.v_fixture_information
        WHERE tournamentId = ? AND stage != 'group'
        ORDER BY category, scheduledTime;
    `;
    return await executeQuery(query, [tournamentId]);
}

async function getCardedPlayers(tournamentId) {
    const query = `
        SELECT 
            playerNumber, 
            playerName, 
            team, 
            cardColor
        FROM cards
        WHERE tournament = ?
        ORDER BY team, playerName;
    `;
    return await executeQuery(query, [tournamentId]);
}

async function getMatchesByPitch(tournamentId) {
    const query = `
        SELECT 
            id,
            pitch,
            stage,
            scheduledTime,
            category,
            team1,
            goals1,
            points1,
            team2,
            goals2,
            points2,
            umpireTeam,
            IF(started IS NULL, 'false', 'true') AS started
        FROM EuroTourno.v_fixture_information
        WHERE tournamentId = ?
        ORDER BY pitch, scheduledTime;
    `;
    return await executeQuery(query, [tournamentId]);
}

async function getFinalsResults(tournamentId) {
    const query = `
        SELECT
            category,
            REPLACE(stage, '_finals', '') AS division,
            team1,
            goals1,
            points1,
            team2,
            goals2,
            points2,
            CASE 
                WHEN (goals1 * 3 + points1) > (goals2 * 3 + points2) THEN team1
                WHEN (goals1 * 3 + points1) < (goals2 * 3 + points2) THEN team2
                ELSE 'Draw'
            END AS winner
        FROM v_fixture_information
        WHERE tournamentId = ? 
            AND stage LIKE '%finals'
        ORDER BY category;
    `;
    return await executeQuery(query, [tournamentId]);
}

async function getAllMatches(tournamentId) {
    const query = `
        SELECT 
            id,
            category,
            groupNumber AS grp,
            stage,
            pitch,
            scheduledTime,
            team1,
            goals1,
            points1,
            team2,
            goals2,
            points2,
            umpireTeam,
            IF(started IS NULL, 'false', 'true') AS started
        FROM EuroTourno.v_fixture_information
        WHERE tournamentId = ?
        ORDER BY scheduledTime;
    `;
    return await executeQuery(query, [tournamentId]);
}

async function loginUser(email, password) {
    console.log(' hay we go 1') 
    const query = `
        SELECT * FROM sec_users 
        WHERE Email = ? AND Pass = ? AND IsActive = 1
    `;
  
    const updateQuery = `
        UPDATE sec_users 
        SET LastAuthenticated = CURDATE() 
        WHERE id = ?
    `;
  console.log('email', email, password)
    const [users] = await executeQuery(query, [email, password]);
  console.log("u", users)
    if (users && users.length > 0) {
        const user = users[0];
        await executeQuery(updateQuery, [user.id]);
        return user;
    }
    return null;
}

module.exports = {
  getRecentMatches,
  getGroupFixtures,
  getGroupStandings,
  getKnockoutFixtures,
  getCardedPlayers,
  getMatchesByPitch,
  getFinalsResults,
  getAllMatches,
  loginUser,
};
