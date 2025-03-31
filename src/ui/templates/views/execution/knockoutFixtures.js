const { UtilTable, UtilRow, ScoreData } = require('../../partials/tableUtils');
const { processTeamName } = require('../../../utils');
const { formatCategory } = require('../../../utils/categoryFormatter');
const {
  getScoreComparisonClasses,
  getFinalScoreDisplay,
  getMatchOutcomeStyles
} = require('../../partials/scoreUtils');

function createKnockoutTable(categoryData) {
    const table = new UtilTable({
        tableClassName: 'knockout-table',
        emptyMessage: `No knockout fixtures found for ${categoryData[0]?.category || 'this category'}.`
    });

    table.addHeaders({
        stage: { label: 'Stage', align: 'left', width: 'auto' },
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

        const { 
            team1ScoreClass, team2ScoreClass,
            team1WinnerClass, team2WinnerClass 
        } = getScoreComparisonClasses(team1ScoreFinal, team2ScoreFinal);

        const specialScores = ['shared', 'walked', 'concede'];
        const score1ExtraClass = specialScores.includes(team1ScoreFinal?.toLowerCase()) ? 'text-orange-600' : '';
        const score2ExtraClass = specialScores.includes(team2ScoreFinal?.toLowerCase()) ? 'text-orange-600' : '';

        const utilRow = new UtilRow()
            .setFields({
                stage: row.stage ? formatCategory(row.stage) : 'N/A',
                team1: row.team1,
                score1: new ScoreData(row.goals1, row.points1),
                team2: row.team2,
                score2: new ScoreData(row.goals2, row.points2)
            })
            .setStyle('team1', { 
                'font-weight': team1WinnerClass ? 'bold' : 'normal',
                'background-color': team1WinnerClass ? 'rgba(0, 255, 0, 0.1)' : 'transparent',
                ...team1Style
            })
            .setStyle('team2', {
                'font-weight': team2WinnerClass ? 'bold' : 'normal',
                'background-color': team2WinnerClass ? 'rgba(0, 255, 0, 0.1)' : 'transparent',
                ...team2Style
            })
            .setStyle('score1', {
                'color': score1ExtraClass ? 'orange' : 'inherit'
            })
            .setStyle('score2', {
                'color': score2ExtraClass ? 'orange' : 'inherit'
            });

        table.addRow(utilRow);
    });

    return table;
}

module.exports = function generateKnockoutFixtures(data) {
    let html = '<div id="knockout-fixtures">';

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
        const table = createKnockoutTable(categoryData);
        html += table.toHTML();
    }

    if (Object.keys(groupedData).length === 0) {
        html += '<p>No knockout fixtures found.</p>';
    }

    html += '</div>';
    return html;
};
