const { processTeamName, formatScore } = require('../../../utils');
const {
  generateTableCell,
  generateTeamCell,
  generateScoreCell,
  generateSpanningHeaderRow,
  generateTable
} = require('../../partials/tableUtils');
const { getScoreComparisonClasses } = require('../../partials/scoreUtils');

// Row generator function for group fixtures
function generateGroupFixtureRow(row) {
    const { teamName: team1Name, teamStyle: team1Style } = processTeamName(row.team1);
    const { teamName: team2Name, teamStyle: team2Style } = processTeamName(row.team2);
    const team1ScoreFormatted = formatScore(row.goals1, row.points1);
    const team2ScoreFormatted = formatScore(row.goals2, row.points2);
    
    const { 
        team1ScoreClass, team2ScoreClass, 
        team1WinnerClass, team2WinnerClass
    } = getScoreComparisonClasses(team1ScoreFormatted, team2ScoreFormatted);

    // N/A style is now handled by generateScoreCell using text-grey class

    let html = '<tr>';
    html += generateTableCell(team1Name, `${team1ScoreClass} ${team1WinnerClass}`, team1Style);
    html += generateScoreCell(row.goals1, row.points1, team1ScoreClass); // Use generateScoreCell
    html += generateTableCell(team2Name, `${team2ScoreClass} ${team2WinnerClass}`, team2Style);
    html += generateScoreCell(row.goals2, row.points2, team2ScoreClass); // Use generateScoreCell
    html += '</tr>';
    return html;
}

module.exports = function generateGroupFixtures(data) {
    let html = '<div id="group-fixtures">';
    
    const headersConfig = [
        { key: 'team1', label: 'Team 1', className: 'table-header' },
        { key: 'score1', label: 'Score 1', className: 'table-header' },
        { key: 'team2', label: 'Team 2', className: 'table-header' },
        { key: 'score2', label: 'Score 2', className: 'table-header' }
    ];

    const colgroupHtml = `
        <colgroup>
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
        
        // Generate the table for this category's fixtures
        html += generateTable({
            data: categoryData,
            headersConfig: headersConfig,
            rowGenerator: generateGroupFixtureRow,
            tableClassName: 'fixtures-table', 
            colgroupHtml: colgroupHtml,
            emptyDataMessage: `No group fixtures found for ${category}.`
        });
    }

    if (Object.keys(groupedData).length === 0) {
         html += '<p>No group fixtures found.</p>'; // Message if there's no data at all
    }

    html += '</div>';
    return html;
};
