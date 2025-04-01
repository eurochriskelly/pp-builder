const { UtilTable, UtilRow, ScoreData } = require('../../partials/tableUtils');
const { processTeamName } = require('../../../utils');
const {
  getScoreComparisonClasses,
  getFinalScoreDisplay,
  getMatchOutcomeStyles,
} = require('../../partials/scoreUtils');

function createFinalsTable(categoryData) {
    const table = new UtilTable({
        tableClassName: 'finals-table',
        emptyMessage: `No finals results found for ${categoryData[0]?.category || 'this category'}.`
    });

    table.addHeaders({
        division: { label: 'Level', align: 'left', width: 'auto' },
        team1: { label: 'Team 1', align: 'left', width: '29%' },
        score1: { label: 'Score 1', align: 'right', width: '14%' },
        team2: { label: 'Team 2', align: 'left', width: '29%' },
        score2: { label: 'Score 2', align: 'right', width: '14%' }
    });

    categoryData.forEach(row => {
        const { teamName: team1Name, teamStyle: team1Style } = processTeamName(row.team1);
        const { teamName: team2Name, teamStyle: team2Style } = processTeamName(row.team2);
        
        const { team1ScoreFinal, team2ScoreFinal } = getFinalScoreDisplay(
            row.goals1, row.points1, row.goals2, row.points2, row.outcome
        );

        const styles = getMatchOutcomeStyles(
            new ScoreData(row.goals1, row.points1, row.outcome),
            new ScoreData(row.goals2, row.points2, row.outcome)
        );

        const utilRow = new UtilRow()
            .setFields({
                division: row?.division?.toUpperCase(),
                team1: row.team1,
                score1: new ScoreData(row.goals1, row.points1),
                team2: row.team2,
                score2: new ScoreData(row.goals2, row.points2)
            })
            .setStyle('team1', {
                'font-weight': styles.team1.fontWeight,
                'background-color': styles.team1.backgroundColor,
                'color': styles.team1.textColor,
                ...team1Style
            })
            .setStyle('team2', {
                'font-weight': styles.team2.fontWeight,
                'background-color': styles.team2.backgroundColor,
                'color': styles.team2.textColor,
                ...team2Style
            })
            .setStyle('score1', {
                'font-weight': styles.team1.fontWeight,
                'color': styles.team1.textColor
            })
            .setStyle('score2', {
                'font-weight': styles.team2.fontWeight,
                'color': styles.team2.textColor
            });

        table.addRow(utilRow);
    });

    return table;
}

module.exports = function generateFinalsResults(data) {
    let html = '<div id="finals-results">';

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
        
        // Generate and add table
        const table = createFinalsTable(categoryData);
        html += table.toHTML();
    }

    if (Object.keys(groupedData).length === 0) {
        html += '<p>No finals results found.</p>';
    }

    html += '</div>';
    return html;
};
