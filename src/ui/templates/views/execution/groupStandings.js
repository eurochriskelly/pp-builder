const {
    generateTableCell,
    generateSpanningHeaderRow,
    generateTable
} = require('../../partials/tableUtils');
const { processTeamName, generateTeamLabel } = require('../../../utils'); // Import generateTeamLabel

// Row generator function for group standings
function generateGroupStandingRow(row, index) {
    const { teamName, teamStyle } = processTeamName(row.team);
    let html = '<tr>';
    
    // Team name and label
    html += generateTableCell(teamName, 'uppercase font-bold text-left', teamStyle);
    const teamLabel = generateTeamLabel(row.team); // Generate label
    html += generateTableCell(`<span>${teamLabel}</span>`, 'text-center'); // Wrap label in span for 'T' column
    
    // Cells for vs columns
    for (let i = 0; i < row.groupTeams.length; i++) {
        // Check if the current column index (i) matches the current row index (index)
        if (i === index) {
            // Team playing itself - add background color
            html += '<td style="background-color: #e5e7eb; min-width: 30px; padding: 8px;" class="text-center">&nbsp;</td>';
        } else {
            // Cell for match against another team (will populate later)
            html += generateTableCell('', 'text-center'); 
        }
    }
    
    // Stats columns
    html += generateTableCell(row.MatchesPlayed, 'text-center');
    html += generateTableCell(row.Wins, 'text-center');
    html += generateTableCell(row.Draws, 'text-center');
    html += generateTableCell(row.Losses, 'text-center');
    html += generateTableCell(row.PointsFrom, 'text-center');
    html += generateTableCell(row.PointsDifference, 'text-center');
    html += generateTableCell(row.TotalPoints, 'text-center');
    
    html += '</tr>';
    return html;
}

module.exports = function generateGroupStandings(data) {
    let html = '<div id="group-standings" class="text-center w-full mx-auto">';
    
    // Generate headers config dynamically based on teams in group
    function getHeadersConfig(teams) {
        const baseHeaders = [
            { key: 'team', label: 'Team', className: 'table-header text-left' },
            { key: 'teamNum', label: 'T', className: 'table-header text-center' } // Remove vertical-text, add text-center
        ];
        
        // Add columns for each team using their generated label
        teams.forEach((team, i) => { // Need the actual team object here
            const label = generateTeamLabel(team.team); // Generate label from team name
            baseHeaders.push({
                key: `vs${i+1}`, 
                label: `<span>${label}</span>`, // Wrap label in span
                className: 'table-header text-center' // Remove vertical-text, add text-center
            });
        });

        // Add standard stats columns
        baseHeaders.push(
            { key: 'MatchesPlayed', label: 'P', className: 'table-header text-center' }, // Remove vertical-text, add text-center
            { key: 'Wins', label: 'W', className: 'table-header text-center' }, // Remove vertical-text, add text-center
            { key: 'Draws', label: 'D', className: 'table-header text-center' }, // Remove vertical-text, add text-center
            { key: 'Losses', label: 'L', className: 'table-header text-center' }, // Remove vertical-text, add text-center
            { key: 'PointsFrom', label: 'SF', className: 'table-header text-center' }, // Remove vertical-text, add text-center
            { key: 'PointsDifference', label: 'SD', className: 'table-header text-center' }, // Remove vertical-text, add text-center
            { key: 'TotalPoints', label: 'Pts', className: 'table-header text-center' } // Remove vertical-text, add text-center
        );

        return baseHeaders;
    }

    // Handle case where data is undefined or empty
    if (!data || Object.keys(data).length === 0) {
        return '<div id="group-standings"><p>No group standings data available.</p></div>';
    }

    for (const cat of Object.keys(data)) {

        for (const groupData of data[cat]) {
            // Sort rows (keep sorting logic here)
            groupData.rows.sort((a, b) => {
                if (b.TotalPoints !== a.TotalPoints) return b.TotalPoints - a.TotalPoints;
                if (b.PointsDifference !== a.PointsDifference) return b.PointsDifference - a.PointsDifference;
                // Add tie-breakers if necessary, e.g., PointsFrom
                if (b.PointsFrom !== a.PointsFrom) return b.PointsFrom - a.PointsFrom; 
                return 0; // Or sort by name if all else fails
            });

            // Skip if no rows data
            if (!groupData.rows || !groupData.rows.length) {
                html += `<p>No standings data available for Group ${groupData.groupName}</p>`;
                continue;
            }

            // Generate headers config based on teams in this group first
            const headersConfig = getHeadersConfig(groupData.rows);
            
            // Then add the spanning header row for the group
            html += generateSpanningHeaderRow(
                `GROUP ${groupData.groupName.toUpperCase()}`,
                headersConfig.length,
                'group-header uppercase text-center font-bold text-xl my-4'
            );
            
            // Generate the table for this group's standings
            html += generateTable({
                data: groupData.rows.map((row, i) => ({
                    ...row,
                    teamNum: i+1,
                    groupTeams: groupData.rows // Ensure groupTeams exists for row generation
                })), // Add team numbers
                headersConfig: headersConfig,
                rowGenerator: (row, i) => generateGroupStandingRow(row, i),
                tableClassName: 'standings-table table-layout-fixed', // Keep table-layout fixed
                colgroupHtml: '', // Remove colgroup usage
                emptyDataMessage: `No standings available for Group ${groupData.groupName}.`
            });
        }
    }

    if (Object.keys(data).length === 0) {
         html += '<p>No group standings available.</p>'; // Message if there's no data at all
    }

    html += '</div>';
    return html;
};

// Note: The custom header generation via generateStandingsHeaders is currently bypassed
// in favor of generateTable's default header row creation based on headersConfig.
// If the specific classes/styles from generateStandingsHeaders are crucial and different
// from what headersConfig provides, generateTable would need modification
// or we'd revert this specific part for groupStandings.
