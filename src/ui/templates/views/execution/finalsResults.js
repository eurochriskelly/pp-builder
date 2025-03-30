const { processTeamName, formatScore } = require('../../../utils');
const { 
  getScoreComparisonClasses,
  getFinalScoreDisplay,
} = require('../../partials/scoreUtils.js');
const { 
  generateTableCell,
  generateTableHeaderRow,
  generateSpanningHeaderRow,
  generateTable,
} = require('../../partials/tableUtils.js');

// Row generator function for finals results
function generateFinalsResultRow(row) {
    const { teamName: team1Name, teamStyle: team1Style } = processTeamName(row.team1);
    const { teamName: team2Name, teamStyle: team2Style } = processTeamName(row.team2);
    const { team1ScoreFinal, team2ScoreFinal } = getFinalScoreDisplay(
        row.goals1, row.points1, row.goals2, row.points2, row.outcome
    );

    const { 
        team1ScoreClass, team2ScoreClass, 
        team1WinnerClass, team2WinnerClass 
    } = getScoreComparisonClasses(team1ScoreFinal, team2ScoreFinal);

    let html = '<tr>';
    html += generateTableCell(row?.division?.toUpperCase());
    html += generateTableCell(team1Name, `${team1ScoreClass} ${team1WinnerClass}`, team1Style);
    html += generateTableCell(team1ScoreFinal, team1ScoreClass);
    html += generateTableCell(team2Name, `${team2ScoreClass} ${team2WinnerClass}`, team2Style);
    html += generateTableCell(team2ScoreFinal, team2ScoreClass);
    html += '</tr>';
    return html;
}

module.exports = function generateFinalsResults(data) {
    let html = '<div id="finals-results">';
    
    const headersConfig = [
        { key: 'division', label: 'Level', className: 'table-header' },
        { key: 'team1', label: 'Team 1', className: 'table-header' },
        { key: 'score1', label: 'Score 1', className: 'table-header' },
        { key: 'team2', label: 'Team 2', className: 'table-header' },
        { key: 'score2', label: 'Score 2', className: 'table-header' }
    ];

    const colgroupHtml = `
        <colgroup>
            <col class="col-level">
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
        
        // Generate the table for this category's results
        html += generateTable({
            data: categoryData,
            headersConfig: headersConfig,
            rowGenerator: generateFinalsResultRow,
            tableClassName: 'finals-table', 
            colgroupHtml: colgroupHtml,
            emptyDataMessage: `No finals results found for ${category}.`
        });
    }

    if (Object.keys(groupedData).length === 0) {
         html += '<p>No finals results found.</p>'; // Message if there's no data at all
    }

    html += '</div>';
    return html;
};
