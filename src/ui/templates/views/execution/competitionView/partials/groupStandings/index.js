const { UtilTable, UtilRow } = require('../../../../../partials/tableUtils');
const { processTeamName } = require('../../../../../../utils/teamName');

/**
 * Generates the header configuration for the group matrix (vs columns).
 * @param {Array} groupRows - The rows data for the group.
 * @returns {Object} Header configuration object for UtilTable.
 */
function generateGroupMatrixHeaders(groupRows) {
    const vsHeaders = {};
    const numTeams = groupRows.length;
    const totalVsColumns = 5;
    const placeholderStyle = { 'background-color': '#f0f0f0' }; // Updated to light gray to match other headers

    // Iterate in forward order to add headers from left to right, up to totalVsColumns
    for (let i = 0; i < totalVsColumns; i++) {
        const fieldName = `vs${i}`;
        if (i < numTeams) {
            // Actual team header
            const row = groupRows[i];
            vsHeaders[fieldName] = {
                label: `<logo-box size="calc(30px * 1.3)" title="${row.team}" />`,
                align: 'center',
                width: '60px' // Set fixed width
            };
        } else {
            // Placeholder header
            vsHeaders[fieldName] = {
                label: '&nbsp;', // Empty label
                align: 'center',
                width: '60px', // Set fixed width
                style: placeholderStyle // Apply light grey background
            };
        }
    }
    return vsHeaders;
}

/**
 * Populates the group matrix cells (vs columns) for a single row.
 * @param {UtilRow} utilRow - The table row object to modify.
 * @param {Array} groupRows - The rows data for the group.
 * @param {number} rowIndex - The index of the current row being processed.
 * @param {Array} fixtures - The list of fixtures for the category.
 */
function generateGroupMatrixRow(utilRow, groupRows, rowIndex, fixtures) {
    const numTeams = groupRows.length;
    const totalVsColumns = 5;
    const placeholderStyle = { 'background-color': '#888' }; // Keep this darker for row cells

    // Iterate columns in forward order to match the updated header order
    for (let colIndex = 0; colIndex < totalVsColumns; colIndex++) {
        const fieldName = `vs${colIndex}`;

        if (colIndex >= numTeams) {
            // This is a placeholder column
            utilRow.setField(fieldName, '&nbsp;')
                   .setStyle(fieldName, placeholderStyle);
        } else if (colIndex === rowIndex) {
            // This is an actual team column intersecting itself
            utilRow.setField(fieldName, '&nbsp;') // Keep content empty
                .setStyle(fieldName, {
                    'background': `repeating-linear-gradient(
                        45deg,
                        #666, /* Dark grey */
                        #666 5px, /* Dark grey stripe width */
                        #ccc 5px, /* Light grey */
                        #ccc 10px /* Light grey stripe width */
                    )`,
                    'padding': '0' // Keep padding 0 for the stripe
                });
        } else {
            // This is an actual team column comparing against another actual team
            const currentRowTeamName = groupRows[rowIndex].team; // Original name from the data row
            const currentColTeamName = groupRows[colIndex].team; // Original name from the corresponding column's data row

            let scoreContent = '&nbsp;'; // Default if no fixture found or not played
            let cellStyle = {
                // Default hatched background for all vs cells initially
                'background': `repeating-linear-gradient(
                    45deg,
                    #666, /* Dark grey */
                    #666 5px, /* Dark grey stripe width */
                    #ccc 5px, /* Light grey */
                    #ccc 10px /* Light grey stripe width */
                )`,
                'padding': '0',
                'margin': '0',
                'text-align': 'center', // Center content by default
            };

            // Check if we have valid team names before proceeding
            if (currentRowTeamName && currentColTeamName) {
                // Find the fixture between the original team names
                const fixture = fixtures.find(f =>
                    (f.team1 === currentRowTeamName && f.team2 === currentColTeamName) ||
                    (f.team1 === currentColTeamName && f.team2 === currentRowTeamName)
                );

                if (fixture) {
                    let goals, points, goalsAgainst, pointsAgainst;

                    // Assign scores based on which team is team1/team2 in the fixture
                    if (fixture.team1 === currentRowTeamName) {
                        goals = fixture.goals1;
                        points = fixture.points1;
                        goalsAgainst = fixture.goals2;
                        pointsAgainst = fixture.points2;
                    } else { // fixture.team2 === currentRowTeamName
                        goals = fixture.goals2;
                        points = fixture.points2;
                        goalsAgainst = fixture.goals1;
                        pointsAgainst = fixture.points1;
                    }

                    // Check if scores are valid numbers before rendering the component
                    if (typeof goals === 'number' && typeof points === 'number' &&
                        typeof goalsAgainst === 'number' && typeof pointsAgainst === 'number') {
                        scoreContent = `<gaelic-score
                                            goals="${goals}"
                                            points="${points}"
                                            goalsagainst="${goalsAgainst}"
                                            pointsagainst="${pointsAgainst}"
                                            layout="compare"
                                            scale="1.0"
                                        />`;
                        // Remove the default hatched background when a score component is rendered
                        delete cellStyle['background'];
                    } else {
                         // Handle cases like walkovers, concessions, or not played yet (scores are null/undefined)
                         // Keep the default hatched background for these cases
                         scoreContent = '-'; // Indicate not played or invalid score
                         cellStyle['color'] = '#aaa';
                         cellStyle['font-style'] = 'italic';
                    }
                } else {
                    // No fixture found at all for these two teams in the provided fixtures list
                    scoreContent = '-';
                    cellStyle['color'] = '#aaa';
                    cellStyle['font-style'] = 'italic';
                }
            } else {
                // This case handles potential null/undefined team names in the source groupData.rows
                // It should be less likely now that we're not relying on regex extraction
                scoreContent = '?'; // Should only appear if original team names are invalid in the input data
                cellStyle['color'] = '#aaa';
                cellStyle['font-style'] = 'italic';
            }

            utilRow.setField(fieldName, scoreContent)
                .setStyle(fieldName, cellStyle);
        }
    }
}

/**
 * Creates the UtilTable instance for group standings.
 * Assumes groupData.rows is already sorted.
 * @param {object} groupData - Data for the group (including rows and groupName).
 * @param {Array} categoryFixtures - Processed fixtures for the category.
 * @returns {UtilTable} The configured UtilTable instance.
 */
function createStandingsTable(groupData, categoryFixtures) { // Renamed fixtures -> categoryFixtures for clarity
    const groupName = groupData?.groupName || 'Unknown'; // Safely access groupName
    const table = new UtilTable({
        tableClassName: 'standings-table table-layout-fixed',
        emptyMessage: `No standings available for Group ${groupName}.` // Use safe groupName
    });

    // Add Team header first
    table.addHeaders({
        team: { label: 'Team', align: 'left', width: 'auto' },
    });

    // Add stats columns
    table.addHeaders({
        MatchesPlayed: { label: 'P', align: 'center', width: '3%' },
        Wins: { label: 'W', align: 'center', width: '3%' },
        Draws: { label: 'D', align: 'center', width: '3%' },
        Losses: { label: 'L', align: 'center', width: '3%' },
        PointsFrom: { label: 'SF', align: 'center', width: '4%' },
        PointsDifference: { label: 'SD', align: 'center', width: '4%' },
        TotalPoints: { label: 'Pts', align: 'center', width: '4%' }
    });

    // Generate and add group matrix headers AFTER stats columns
    const vsHeaders = generateGroupMatrixHeaders(groupData.rows);
    table.addHeaders(vsHeaders);

    // Add rows
    groupData.rows.forEach((row, rowIndex) => {
        const { teamName, teamStyle } = processTeamName(row.team);
        const w = '240px';
        const teamLabel = `
            <div style="display: flex; justify-content: flex-start; align-items: center; overflow:hidden;width: ${w};min-width:${w};max-width:${w}">
                <team-name name="${row.team}" height="30px" direction="l2r" />
            </div>
        `;

        const fields = {
          ...row,
          team: teamLabel,
        }

        const utilRow = new UtilRow()
            .setFields(fields)
            .setStyle('team', {
                'font-weight': 'bold',
                'text-transform': 'uppercase',
                ...teamStyle
            });

        // Apply specific styles to the stats columns
        utilRow
            .setStyle('TotalPoints', { 'font-weight': 'bold' }) // Keep bold style
            .addBorder('TotalPoints', 'right');                 // Change left to right border to separate from matrix

        // Populate the group matrix cells for this row using the existing function
        // Pass categoryFixtures instead of just fixtures
        generateGroupMatrixRow(utilRow, groupData.rows, rowIndex, categoryFixtures);
 
        table.addRow(utilRow);
    });
 
    return table;
}

/**
 * Generates HTML for a single group's standings table.
 * Assumes groupData.rows is already sorted by the caller.
 * Assumes categoryFixtures are already processed (diff1, diff2 calculated) by the caller.
 * @param {object} groupData - Data for the specific group (must include groupName and sorted rows).
 * @param {Array} categoryFixtures - All *processed* fixtures for the category this group belongs to.
 * @returns {string} HTML string for the group standings table, or an error message.
 */
function generateSingleGroupStandings(groupData, categoryFixtures) {
    const groupName = groupData?.groupName; // Use optional chaining

    // Validate input
    if (!groupData || !groupData.rows || !groupData.rows.length || !groupName || !categoryFixtures) {
        const displayGroupName = groupName || 'Unknown';
        console.error(`Invalid data passed to generateSingleGroupStandings for group: ${displayGroupName}`, { groupData: !!groupData, rows: groupData?.rows?.length, groupName, categoryFixtures: !!categoryFixtures });
        // Return just the paragraph, the caller will handle wrapping divs/headers
        return `<p>No standings data available for Group ${displayGroupName}</p>`;
    }

    // Note: Sorting is assumed to be done by the caller before passing groupData.
    // Note: Filtering and mapping fixtures is assumed to be done by the caller.

    // Generate and return table HTML directly.
    // The caller is responsible for adding group headers (e.g., <h3>GROUP A</h3>).
    const table = createStandingsTable(groupData, categoryFixtures); // Pass processed fixtures
    return table.toHTML();

    // Note: The <style> block was removed. It should be included globally or once by the caller.
};

// Export the new function name
module.exports = generateSingleGroupStandings;
