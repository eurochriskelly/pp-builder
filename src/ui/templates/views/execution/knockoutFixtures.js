const { UtilTable, UtilRow, ScoreData } = require('../../partials/tableUtils');
const { processTeamName } = require('../../../utils');
const { formatCategory } = require('../../../utils/categoryFormatter');
const { parseStageToLevel, abbreviateStage } = require('../../../utils/stageParser');
const {
  getScoreComparisonClasses,
  getFinalScoreDisplay,
  getMatchOutcomeStyles,
} = require('../../partials/scoreUtils');

function createKnockoutTable(categoryData) {
    const table = new UtilTable({
        tableClassName: 'fixtures-table',
        emptyMessage: `No knockout fixtures found for ${categoryData[0]?.category || 'this category'}.`
    });

    table.addHeaders({
        team1: { label: 'Team 1', align: 'left', width: '35%' },
        score1: { label: 'Score 1', align: 'center', width: '10%' },
        rank1: { label: 'R', align: 'left', width: '3%' },
        stage: { label: 'Stage', align: 'center', width: '4%' },
        rank2: { label: 'R', align: 'right', width: '3%' },
        score2: { label: 'Score 2', align: 'center', width: '10%' },
        team2: { label: 'Team 2', align: 'left', width: '35%' }
    })
    .noHeader();

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

        const specialScores = ['shared', 'walked', 'concede'];
        const score1ExtraClass = specialScores.includes(team1ScoreFinal?.toLowerCase()) ? 'orange' : styles.team1.textColor;
        const score2ExtraClass = specialScores.includes(team2ScoreFinal?.toLowerCase()) ? 'orange' : styles.team2.textColor;

        const team1Won = row.outcome === 'played' && 
            new ScoreData(row.goals1, row.points1).total > new ScoreData(row.goals2, row.points2).total;
        const team2Won = row.outcome === 'played' && 
            new ScoreData(row.goals2, row.points2).total > new ScoreData(row.goals1, row.points1).total;

        const utilRow = new UtilRow()
            .setFields({
                team1: `<team-name name="${team1Won ? row.team1 : row.team2}" direction="r2l" />`,
                score1: new ScoreData(team1Won ? row.goals1 : row.goals2, team1Won ? row.points1 : row.points2),
                rank1: 'R',
                stage: row.stage ? abbreviateStage(row.stage) : 'N/A',
                rank2: 'R',
                score2: new ScoreData(team1Won ? row.goals2 : row.goals1, team1Won ? row.points2 : row.points1),
                team2: `<team-name name="${team1Won ? row.team2 : row.team1}" />`
            })
            .setStyle('team1', {
                'font-weight': styles.team1.fontWeight,
                'color': styles.team1.textColor,
                ...team1Style
            })
            .setStyle('team2', {
                'font-weight': styles.team2.fontWeight,
                'color': styles.team2.textColor,
                ...team2Style
            })
            .setStyle('score1', {
                'font-weight': styles.team1.fontWeight,
                'color': score1ExtraClass
            })
            .setStyle('score2', {
                'font-weight': styles.team2.fontWeight,
                'color': score2ExtraClass
            })
            .setStyle('rank1', {
                'padding': '0',
                'margin': '0',
                'font-size': '1em',
                'vertical-align': 'middle',
                'line-height': '1.2'
            })
            .setStyle('rank2', {
                'padding': '0',
                'margin': '0',
                'font-size': '1em',
                'vertical-align': 'middle',
                'line-height': '1.2'
            })
            .setStyle('stage', {
                'font-size': '0.9em',
                'font-weight': 'bold',
                'color': '#666'
            });

        table.addRow(utilRow);
    });

    return table;
}

module.exports = function generateKnockoutFixtures(data) {
    let html = '<div id="knockout-fixtures">';

    // Group data by category and sort by stage level
    const groupedData = data.reduce((acc, row) => {
        const category = row.category || 'Uncategorized';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push({
            ...row,
            stageLevel: parseStageToLevel(row.stage)
        });
        return acc;
    }, {});

    // Sort each category's matches by stage level (highest first)
    for (const category in groupedData) {
        groupedData[category].sort((a, b) => b.stageLevel - a.stageLevel);
    }

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
