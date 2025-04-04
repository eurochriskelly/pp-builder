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
        });

        table.addHeaders({
            team1: { label: 'Team 1', align: 'left', width: '35%' },
            score1: { label: 'Score 1', align: 'right', width: '15%' },
            team2: { label: 'Team 2', align: 'left', width: '35%' },
            score2: { label: 'Score 2', align: 'right', width: '15%' }
        });

        // Add rows
        categoryData.forEach(row => {
            const { teamName: team1Name } = processTeamName(row.team1);
            const { teamName: team2Name } = processTeamName(row.team2);
            
            const team1Score = new ScoreData(row.goals1, row.points1);
            const team2Score = new ScoreData(row.goals2, row.points2);
            
            const styles = getMatchOutcomeStyles(team1Score, team2Score);

            const utilRow = new UtilRow()
                .setFields({
                    team1: row.team1,
                    score1: team1Score,
                    team2: row.team2, 
                    score2: team2Score
                })
                .setStyle('team1', {
                    'font-weight': styles.team1.fontWeight,
                    'background-color': styles.team1.backgroundColor,
                    'color': styles.team1.textColor
                })
                .setStyle('team2', {
                    'font-weight': styles.team2.fontWeight,
                    'background-color': styles.team2.backgroundColor,
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
