const {
    generateTableCell,
    generateSpanningHeaderRow,
    generateTable
} = require('../../partials/tableUtils');
const { processTeamName } = require('../../../utils'); // For consistent team styling

// Row generator function for group standings
function generateGroupStandingRow(row) {
    const { teamName, teamStyle } = processTeamName(row.team); // Use consistent team styling
    let html = '<tr>';
    // Apply team style (dynamic) and text-left class
    html += generateTableCell(teamName, 'uppercase font-bold text-left', teamStyle); 
    // Use text-center class for stats
    html += generateTableCell(row.MatchesPlayed, 'text-center');
    html += generateTableCell(row.Wins, 'text-center');
    html += generateTableCell(row.Draws, 'text-center');
    html += generateTableCell(row.Losses, 'text-center');
    html += generateTableCell(row.PointsFrom, 'text-center'); // Scores For
    html += generateTableCell(row.PointsDifference, 'text-center'); // Score Diff
    html += generateTableCell(row.TotalPoints, 'text-center'); // Points
    html += '</tr>';
    return html;
}

module.exports = function generateGroupStandings(data) {
    let html = '<div id="group-standings">';
    
    const headersConfig = [
        { key: 'team', label: 'Team', className: 'table-header text-left' },
        { key: 'MatchesPlayed', label: 'P', className: 'table-header vertical-head' },
        { key: 'Wins', label: 'W', className: 'table-header vertical-head' },
        { key: 'Draws', label: 'D', className: 'table-header vertical-head' },
        { key: 'Losses', label: 'L', className: 'table-header vertical-head' },
        { key: 'PointsFrom', label: 'SF', className: 'table-header vertical-head' }, // Scores For
        { key: 'PointsDifference', label: 'SD', className: 'table-header vertical-head' }, // Score Diff
        { key: 'TotalPoints', label: 'Pts', className: 'table-header vertical-head' } // Points
    ];

    const colgroupHtml = `
        <colgroup>
            <col class="col-team">
            <col class="col-stat">
            <col class="col-stat">
            <col class="col-stat">
            <col class="col-stat">
            <col class="col-stat-wide">
            <col class="col-stat-wide">
            <col class="col-stat-wide">
        </colgroup>
    `;

    for (const cat of Object.keys(data)) {
        // Add the spanning header row for the category
        const categoryHeaderContent = `<h2>${cat.toUpperCase()}</h2>`;
        // Use headersConfig.length for colspan
        html += generateSpanningHeaderRow(categoryHeaderContent, headersConfig.length, 'category-header'); 

        for (const groupData of data[cat]) {
            // Sort rows (keep sorting logic here)
            groupData.rows.sort((a, b) => {
                if (b.TotalPoints !== a.TotalPoints) return b.TotalPoints - a.TotalPoints;
                if (b.PointsDifference !== a.PointsDifference) return b.PointsDifference - a.PointsDifference;
                // Add tie-breakers if necessary, e.g., PointsFrom
                if (b.PointsFrom !== a.PointsFrom) return b.PointsFrom - a.PointsFrom; 
                return 0; // Or sort by name if all else fails
            });

            // Add the spanning header row for the group
            html += generateSpanningHeaderRow(`Group ${groupData.groupName}`, headersConfig.length, 'group-header'); 

            // Generate the table for this group's standings
            html += generateTable({
                data: groupData.rows, // Use the sorted rows
                headersConfig: headersConfig,
                rowGenerator: generateGroupStandingRow,
                // Pass table-layout-fixed as a class
                tableClassName: 'standings-table table-layout-fixed', 
                // tableStyle: 'table-layout: fixed;', // Remove inline style
                colgroupHtml: colgroupHtml,
                // Use generateStandingsHeaders for the header row within generateTable
                // Need to adjust generateTable or pass header generator...
                // For now, let's rely on generateTable's default header generation
                // If generateStandingsHeaders is strictly needed, we'd need to modify generateTable
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
