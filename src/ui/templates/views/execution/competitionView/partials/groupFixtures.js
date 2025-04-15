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
            team1: { label: 'Team 1', align: 'left', width: 'auto' },
            score1: { label: 'Score 1', align: 'center', width: '8%' },
            winner1: { label: '', align: 'left', width: '2%' },
            level: { label: 'Level', align: 'center', width: 'auto' },
            winner2: { label: '', align: 'right', width: '2%' },
            score2: { label: 'Score 2', align: 'center', width: '8%' },
            team2: { label: 'Team 2', align: 'left', width: 'auto' },
        })
        .noHeader();

    // Add rows using the passed groupFixtures directly
    groupFixtures.forEach(row => {
        const team1Score = new ScoreData(row.goals1, row.points1);
        const team2Score = new ScoreData(row.goals2, row.points2);
        const styles = getMatchOutcomeStyles(team1Score, team2Score);

        // Calculate total scores properly (3 points per goal + 1 point per point)
        const team1Total = (row.goals1 * 3) + row.points1;
        const team2Total = (row.goals2 * 3) + row.points2;

        // Determine winner based on the proper total calculation
        const team1Won = team1Total > team2Total;
        const team2Won = team2Total > team1Total;

        // Create the gaelic-score components for team1 and team2
        const isPlayed = typeof row.goals1 === 'number' && typeof row.points1 === 'number' &&
            typeof row.goals2 === 'number' && typeof row.points2 === 'number';

        // Create score components - maintaining original team order
        const score1Html = `<gaelic-score 
                goals="${row.goals1}" 
                points="${row.points1}" 
                layout="over" 
                scale="0.75" 
                played="${isPlayed}" 
                goalsagainst="${row.goals2}" 
                pointsagainst="${row.points2}">
            </gaelic-score>`;

        const score2Html = `<gaelic-score 
                goals="${row.goals2}" 
                points="${row.points2}" 
                layout="over" 
                scale="0.75" 
                played="${isPlayed}" 
                goalsagainst="${row.goals1}" 
                pointsagainst="${row.points1}">
            </gaelic-score>`;

        // Update the ScoreData objects with custom HTML
        team1Score.customHtml = score1Html;
        team2Score.customHtml = score2Html;

        const w = 'auto';
        const utilRow = new UtilRow()
            .setFields({
                team1: `
                        <div style="display: flex; justify-content: flex-end; align-items: center; width: ${w};min-width:${w};max-width:${w}">
                            <team-name name="${row.team1}" direction="r2l" />
                        </div>
                    `,
                score1: team1Score, // Now uses customHtml from ScoreData
                winner1: team1Won ? '◄' : '',
                level: `<knockout-level stage="group" group="${groupName}" match-id="${row.id || ''}" />`,
                winner2: team2Won ? '►' : '',
                score2: team2Score, // Now uses customHtml from ScoreData
                team2: `
                        <div style="display: flex; align-items: left; width: ${w};min-width:${w};max-width:${w}">
                            <team-name name="${row.team2}" />
                        </div>
                    `,
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
                'text-align': 'center',
                'vertical-align': 'middle',
                'max-width': '46px',
                'padding': '0'
            })
            .setStyle('level', {
                'margin': '0',
                'padding': '0',
                'max-width': '60px !important',
                'width': '60px',
                'min-width': '60px',
            })
            .setStyle('score2', {
                'font-weight': styles.team2.fontWeight,
                'color': styles.team2.textColor,
                'text-align': 'center',
                'vertical-align': 'middle',
                'max-width': '46px',
                'padding': '0'
            })
            .setStyle('winner1', {
                'padding': '0',
                'margin': '0',
                'font-size': '1em',
                'max-width': '1em',
                'vertical-align': 'middle',
                'line-height': '1.2'
            })
            .setStyle('winner2', {
                'padding': '0',
                'margin': '0',
                'max-width': '1em',
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
