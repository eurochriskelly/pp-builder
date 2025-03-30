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
    
    // Empty cells for vs columns (will populate later)
    for (let i = 0; i < row.groupTeams.length; i++) {
        html += generateTableCell('', 'text-center');
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
            { key: 'teamNum', label: 'T', className: 'table-header vertical-text' } // Use vertical-text
        ];
        
        // Add columns for each team using their generated label
        teams.forEach((team, i) => { // Need the actual team object here
            const label = generateTeamLabel(team.team); // Generate label from team name
            baseHeaders.push({
                key: `vs${i+1}`, 
                label: `<span>${label}</span>`, // Wrap label in span
                className: 'table-header vertical-text' // Use vertical-text
            });
        });

        // Add standard stats columns
        baseHeaders.push(
            { key: 'MatchesPlayed', label: 'P', className: 'table-header vertical-text' }, // Use vertical-text
            { key: 'Wins', label: 'W', className: 'table-header vertical-text' }, // Use vertical-text
            { key: 'Draws', label: 'D', className: 'table-header vertical-text' }, // Use vertical-text
            { key: 'Losses', label: 'L', className: 'table-header vertical-text' }, // Use vertical-text
            { key: 'PointsFrom', label: 'SF', className: 'table-header vertical-text' }, // Use vertical-text
            { key: 'PointsDifference', label: 'SD', className: 'table-header vertical-text' }, // Use vertical-text
            { key: 'TotalPoints', label: 'Pts', className: 'table-header vertical-text' } // Use vertical-text
        );

        return baseHeaders;
    }

    const colgroupHtml = `
        <colgroup>
            <col class="col-team">
            <col class="col-stat">
            <col class="col-stat">
            <col class="col-stat">
            <col class="col-stat">
            <col class="col-stat">
            <col class="col-stat">
            <col class="col-stat">
            <col class="col-stat-wide">
            <col class="col-stat-wide">
            <col class="col-stat-wide">
        </colgroup>
    `;

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
                tableClassName: 'standings-table table-layout-fixed',
                colgroupHtml: colgroupHtml,
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
