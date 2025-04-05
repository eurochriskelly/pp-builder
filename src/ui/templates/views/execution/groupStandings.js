const { UtilTable, UtilRow } = require('../../partials/tableUtils');
const { processTeamName, generateTeamLabel } = require('../../../utils');

function createStandingsTable(groupData, fixtures) {
    const table = new UtilTable({
        tableClassName: 'standings-table table-layout-fixed',
        emptyMessage: `No standings available for Group ${groupData.groupName}.`
    });

    // Add fixed headers
    table.addHeaders({
        team: { label: 'Team', align: 'left', width: 'auto' },
    });

    // First add all vs columns at once
    const vsHeaders = {};
    groupData.rows.forEach((row, i) => {
        vsHeaders[`vs${i}`] = {
            label: `<logo-box size="calc(30px * 1.3)" title="${row.team}" />`,
            align: 'center',
            width: '5%'
        };
    });
    table.addHeaders(vsHeaders);

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

    // Add rows
    groupData.rows.forEach((row, rowIndex) => {
        console.log('processing row ', rowIndex);

        const { teamName, teamStyle } = processTeamName(row.team);
        const teamLabel = `<team-name name="${row.team}" height="30px" direction="r2l" />`;

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

        // Add vs columns - we need to ensure all vs columns exist for each row
        groupData.rows.forEach((r, colIndex) => {
            const fieldName = `vs${colIndex}`;
            if (colIndex === rowIndex) {
                // Apply a diagonal stripe pattern for the cell where a team intersects itself
                utilRow.setField(fieldName, '&nbsp;')
                    .setStyle(fieldName, {
                        'background': `repeating-linear-gradient(
                            45deg,
                            #666, /* Dark grey */
                            #666 5px, /* Dark grey stripe width */
                            #ccc 5px, /* Light grey */
                            #ccc 10px /* Light grey stripe width */
                        )`,
                        'padding': '0'
                    });
            } else {
                // Access original team names directly using indices from the loops
                const currentRowTeamName = groupData.rows[rowIndex].team; // Original name from the data row
                const currentColTeamName = groupData.rows[colIndex].team; // Original name from the corresponding column's data row

                let scoreContent = '&nbsp;'; // Default if no fixture found or not played
                let cellStyle = {
                    'background-color': '#eee', // Default background for empty/TBD cells
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
                            // Remove default background for cells with actual scores
                            delete cellStyle['background-color'];
                        } else {
                             // Handle cases like walkovers, concessions, or not played yet (scores are null/undefined)
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
        });

        table.addRow(utilRow);
    });

    return table;
}

module.exports = function generateGroupStandings(data, groupFixtures) {
    let html = '<div id="group-standings" class="text-center w-full mx-auto">';

    // Handle case where data is undefined or empty
    if (!data || Object.keys(data).length === 0) {
        return '<div id="group-standings"><p>No group standings data available.</p></div>';
    }


    for (const cat of Object.keys(data)) {
        const fixtures = groupFixtures
           .filter(x => x.category === cat)
           .map(x => {
              const { goals1, points1, goals2, points2 } = x;
              const score1 = goals1 * 3 + points1;
              const score2 = goals2 * 3 + points2;
              return {
                 ...x,
                 diff1: score1 - score2,
                 diff2: score2 - score1,
              }
           })
        for (const groupData of data[cat]) {
            // Sort rows (keep sorting logic here)
            groupData.rows.sort((a, b) => {
                if (b.TotalPoints !== a.TotalPoints) return b.TotalPoints - a.TotalPoints;
                if (b.PointsDifference !== a.PointsDifference) return b.PointsDifference - a.PointsDifference;
                if (b.PointsFrom !== a.PointsFrom) return b.PointsFrom - a.PointsFrom;
                return 0;
            });

            // Skip if no rows data
            if (!groupData.rows || !groupData.rows.length) {
                html += `<p>No standings data available for Group ${groupData.groupName}</p>`;
                continue;
            }

            // Add group header
            html += `<h3 class="group-header uppercase text-center font-bold text-xl my-4">GROUP ${groupData.groupName.toUpperCase()}</h3>`;
            
            // Generate and add table
            const table = createStandingsTable(groupData, fixtures);
            html += table.toHTML();
        }
    }

    if (Object.keys(data).length === 0) {
        html += '<p>No group standings available.</p>';
    }

    html += `
        <style>
            .logo-cell {
                padding: 2px !important;
                width: 40px;
                height: 40px;
                min-width: 40px;
                min-height: 40px;
            }
            .logo-cell logo-box {
                display: block;
                width: 100%;
                height: 100%;
            }
        </style>
    </div>`;
    return html;
};
