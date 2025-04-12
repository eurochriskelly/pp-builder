const { processTeamName } = require('../../../../../utils');
const { UtilTable, UtilRow, ScoreData } = require('../../../../partials/tableUtils');
const { getMatchOutcomeStyles } = require('../../../../partials/scoreUtils');

/**
 * Generates HTML for a single group's fixtures table.
 * @param {Array} groupFixtures - Array of fixture objects for the specific group.
 * @param {string} groupName - The name of the group (used for empty message).
 * @returns {string} HTML string for the group fixtures table, or an error message.
 */
function generateSingleGroupFixtures(groupFixtures, groupName) {
    console.log(`generateSingleGroupFixtures called for Group ${groupName} with ${groupFixtures?.length ?? 0} fixtures.`);

    // Handle case where data is undefined or empty
    if (!groupFixtures || groupFixtures.length === 0) {
        console.log(`--> No fixtures found for Group ${groupName}, returning empty message.`);
        // Return just the paragraph, the caller will handle wrapping divs/headers
        return `<p>No group fixtures found for Group ${groupName}.</p>`;
    }

    // Create table with headers
    const table = new UtilTable({
        tableClassName: 'fixtures-table',
        emptyMessage: `No group fixtures found for Group ${groupName}.`
      })
      .addHeaders({
          team1: { label: 'Team 1', align: 'left', width: '28%' },
            score1: { label: 'Score 1', align: 'center', width: '8%' },
            winner1: { label: '', align: 'left', width: '4%' },
          level: { label: 'Level', align: 'center', width: '12%' },
            winner2: { label: '', align: 'right', width: '4%' },
            score2: { label: 'Score 2', align: 'center', width: '8%' },
          team2: { label: 'Team 2', align: 'left', width: '28%' },
          })
        .noHeader();

        // Add rows using the passed groupFixtures directly
        groupFixtures.forEach(row => {
            // processTeamName is not strictly needed here as we use team-name component
            // const { teamName: team1Name } = processTeamName(row.team1);
            // const { teamName: team2Name } = processTeamName(row.team2);
            const team1Score = new ScoreData(row.goals1, row.points1);
            const team2Score = new ScoreData(row.goals2, row.points2);
            
            const styles = getMatchOutcomeStyles(team1Score, team2Score);

            const team1Won = team1Score.total > team2Score.total;
            const team2Won = team2Score.total > team1Score.total;
      console.log('t1s', team1Score)
            
            const utilRow = new UtilRow()
                .setFields({
                    team1: `<team-name name="${team1Won ? row.team1 : row.team2}" direction="r2l" />`,
                    score1: team1Won ? team1Score : team2Score,
                    winner1: team1Won ? '◄' : '',
                    level: `<knockout-level stage="group" group="${groupName}" match-id="${row.id || ''}" />`,
                    winner2: team2Won ? '►' : '',
                    score2: team1Won ? team2Score : team1Score,
                    team2: `<team-name name="${team1Won ? row.team2 : row.team1}" />`, 
                })
                .setStyle('team1', {
                    'font-weight': styles.team1.fontWeight,
                    'color': styles.team1.textColor
                })
                .setStyle('team2', {
                    'font-weight': styles.team2.fontWeight,
                    'color': styles.team2.textColor,
                })
                .setStyle('score1', {
                    'font-weight': styles.team1.fontWeight,
                    'color': styles.team1.textColor, 
                })
                .setStyle('score2', {
                    'font-weight': styles.team2.fontWeight,
                    'color': styles.team2.textColor
                })
                .setStyle('winner1', {
                    'padding': '0',
                    'margin': '0',
                    'font-size': '1em',
                    'vertical-align': 'middle',
                    'line-height': '1.2'
                })
                .setStyle('winner2', {
                    'padding': '0',
                    'margin': '0',
                    'font-size': '1em',
                    'vertical-align': 'middle',
                    'line-height': '1.2'
                });

            table.addRow(utilRow);
        });

        // Return the table HTML directly. The caller handles wrapping divs.
        return table.toHTML();

};

// Export the new function name
module.exports = generateSingleGroupFixtures;
