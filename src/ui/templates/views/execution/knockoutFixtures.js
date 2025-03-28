const { processTeamName, formatScore } = require('../../../utils');
const { formatCategory } = require('../../../utils/categoryFormatter');
// Removed duplicate import of formatCategory
const {
  generateTableCell,
  generateTableHeaderRow,
  // generateTableHeaderCell, // No longer needed directly
  generateSpanningHeaderRow,
  getScoreComparisonClasses,
  getFinalScoreDisplay,
  generateTable // Import the new utility
} = require('../../partials/utils');

// Row generator function for knockout fixtures
function generateKnockoutFixtureRow(row) {
    const { teamName: team1Name, teamStyle: team1Style } = processTeamName(row.team1);
    const { teamName: team2Name, teamStyle: team2Style } = processTeamName(row.team2);
    
    const { team1ScoreFinal, team2ScoreFinal } = getFinalScoreDisplay(
        row.goals1, row.points1, row.goals2, row.points2, row.outcome
    );

    const { 
        team1ScoreClass, team2ScoreClass, 
        team1WinnerClass, team2WinnerClass 
    } = getScoreComparisonClasses(team1ScoreFinal, team2ScoreFinal);

    const specialScores = ['shared', 'walked', 'concede'];
    const score1ExtraClass = specialScores.includes(team1ScoreFinal?.toLowerCase()) ? 'text-orange-600' : ''; // Keep special class for now
    const score2ExtraClass = specialScores.includes(team2ScoreFinal?.toLowerCase()) ? 'text-orange-600' : ''; // Keep special class for now

    let html = '<tr>';
    html += generateTableCell(row.stage ? formatCategory(row.stage) : 'N/A', 'text-left');
    html += generateTableCell(team1Name, `${team1ScoreClass} ${team1WinnerClass} text-left`, team1Style);
    // Add text-right class for score alignment
    html += generateTableCell(team1ScoreFinal?.toUpperCase(), `${team1ScoreClass} ${score1ExtraClass} text-right`); 
    html += generateTableCell(team2Name, `${team2ScoreClass} ${team2WinnerClass} text-left`, team2Style);
    // Add text-right class for score alignment
    html += generateTableCell(team2ScoreFinal?.toUpperCase(), `${team2ScoreClass} ${score2ExtraClass} text-right`); 
    html += '</tr>';
    return html;
}

module.exports = function generateKnockoutFixtures(data) {
    let html = '<div id="knockout-fixtures">';
    
    const headersConfig = [
        { key: 'stage', label: 'Stage', className: 'table-header text-left' },
        { key: 'team1', label: 'Team 1', className: 'table-header text-left' },
        { key: 'score1', label: 'Score 1', className: 'table-header text-right' },
        { key: 'team2', label: 'Team 2', className: 'table-header text-left' },
        { key: 'score2', label: 'Score 2', className: 'table-header text-right' }
    ];

    const colgroupHtml = `
        <colgroup>
            <col class="col-stage">
            <col class="col-team">
            <col class="col-score">
            <col class="col-team">
            <col class="col-score">
        </colgroup>
    `;

    // Group data by category
    const groupedData = data.reduce((acc, row) => {
        const category = row.category || 'Uncategorized';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(row);
        return acc;
    }, {});

    // Generate a table for each category
    for (const category in groupedData) {
        const categoryData = groupedData[category];
        // Add the spanning header row for the category
        html += generateSpanningHeaderRow(formatCategory(category), headersConfig.length, 'category-header'); 
        
        // Generate the table for this category's fixtures
        html += generateTable({
            data: categoryData,
            headersConfig: headersConfig,
            rowGenerator: generateKnockoutFixtureRow,
            tableClassName: 'knockout-table', 
            colgroupHtml: colgroupHtml,
            emptyDataMessage: `No knockout fixtures found for ${category}.`
        });
    }

    if (Object.keys(groupedData).length === 0) {
         html += '<p>No knockout fixtures found.</p>'; // Message if there's no data at all
    }

    html += '</div>';
    return html;
};
