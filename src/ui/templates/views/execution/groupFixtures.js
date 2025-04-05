const { processTeamName } = require('../../../utils');
const { UtilTable, UtilRow, ScoreData } = require('../../partials/tableUtils');
const { getMatchOutcomeStyles } = require('../../partials/scoreUtils');

module.exports = function generateGroupFixtures(data) {
    let html = '<div id="group-fixtures" class="text-center w-full mx-auto">';
    
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
        
        // Create table with headers
        const table = new UtilTable({
            tableClassName: 'fixtures-table',
            emptyMessage: `No group fixtures found for ${category}.`
          })
          .addHeaders({
            team1: { label: 'Team 1', align: 'left', width: '38%' },
            score1: { label: 'Score 1', align: 'center', width: '12%' },
            score2: { label: 'Score 2', align: 'center', width: '12%' },
            team2: { label: 'Team 2', align: 'left', width: '38%' },
          })
          .noHeader()

        // Add rows
        categoryData.forEach(row => {
            const { teamName: team1Name } = processTeamName(row.team1);
            const { teamName: team2Name } = processTeamName(row.team2);
            
            const team1Score = new ScoreData(row.goals1, row.points1);
            const team2Score = new ScoreData(row.goals2, row.points2);
            
            const styles = getMatchOutcomeStyles(team1Score, team2Score);

            const utilRow = new UtilRow()
                .setFields({
                    team1: `<team-name name="${row.team1}" direction="r2l" />`,
                    score1: team1Score,
                    score2: team2Score,
                    team2: `<team-name name="${row.team2}" />`, 
                })
                .setStyle('team1', {
                    'font-weight': styles.team1.fontWeight,
                    'color': styles.team1.textColor
                })
                .setStyle('team2', {
                    'font-weight': styles.team2.fontWeight,
                    'color': styles.team2.textColor
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

        html += table.toHTML();
    }

    if (Object.keys(groupedData).length === 0) {
        html += '<p>No group fixtures found.</p>';
    }

    html += '</div>';
    return html;
};
