const { UtilTable, UtilRow, ScoreData } = require('../../partials/tableUtils');
const { processTeamName } = require('../../../utils');
const { formatCategory } = require('../../../utils/categoryFormatter');
const { parseStageToLevel, abbreviateStage } = require('../../../utils/stageParser');
const {
  getScoreComparisonClasses,
  getFinalScoreDisplay,
  getMatchOutcomeStyles,
} = require('../../partials/scoreUtils');

function getTeamLastFixtures(categoryData) {
    const teamLastFixtures = {};
    
    categoryData.forEach(match => {
        if (match.outcome === 'played') {
            teamLastFixtures[match.team1] = match;
            teamLastFixtures[match.team2] = match;
        }
    });
    
    return Object.entries(teamLastFixtures).map(([team, fixture]) => ({
        team,
        lastFixture: fixture
    }));
}

function createKnockoutTable(categoryData) {
    const table = new UtilTable({
        tableClassName: 'fixtures-table',
        emptyMessage: `No knockout fixtures found for ${categoryData[0]?.category || 'this category'}.`
    });

    // Get each team's last match
    const teamLastFixtures = getTeamLastFixtures(categoryData);
    
    table.addHeaders({
        team1: { label: 'Team 1', align: 'left', width: 'auto' },
        score1: { label: 'Score 1', align: 'center', width: '80px' },
        rank1: { label: 'X', align: 'left', width: '3%' },
        stage: { label: 'Stage', align: 'center', width: '4%' },
        rank2: { label: 'X', align: 'right', width: '3%' },
        score2: { label: 'Score 2', align: 'center', width: '80px' },
        team2: { label: 'Team 2', align: 'left', width: 'auto' }
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

        // For knockout fixtures, we keep original team order but show winner on left
        let team1 = row.team1;
        let team2 = row.team2;
        let score1 = new ScoreData(row.goals1, row.points1);
        let score2 = new ScoreData(row.goals2, row.points2);
        
        // Only swap display order if team2 won and it's a played match
        if (row.outcome === 'played' && team2Won) {
            [team1, team2] = [team2, team1];
            [score1, score2] = [score2, score1];
        } else {
            // Ensure we use the original scores for styling
            score1 = new ScoreData(row.goals1, row.points1);
            score2 = new ScoreData(row.goals2, row.points2);
        }

        // Get styles based on original team order (not swapped display order)
        const originalStyles = getMatchOutcomeStyles(
            new ScoreData(row.goals1, row.points1, row.outcome),
            new ScoreData(row.goals2, row.points2, row.outcome)
        );

        // Check if this is each team's last match
        const isTeam1Last = teamLastFixtures.some(f => f.team === team1 && f.lastFixture === row);
        const isTeam2Last = teamLastFixtures.some(f => f.team === team2 && f.lastFixture === row);

        // Determine round and progression based on stage
        const stageParts = row.stage?.split('_') || [];
        const roundName = stageParts[0] || '';
        let round = 0;
        let progression = 0;
        
        if (roundName === 'cup') round = 0;
        else if (roundName === 'shield') round = 3;
        else if (roundName === 'plate') round = 6;
        
        if (stageParts[1]?.includes('quarter')) progression = 3;
        else if (stageParts[1]?.includes('semi') || stageParts[1]?.includes('3rd4th')) progression = 2;
        else if (stageParts[1]?.includes('final')) progression = 1;
 
        // Calculate indent width for staggered display (earlier rounds = more indent)
        // progression: 1=final, 2=semi/3rd4th, 3=quarter
        // indent: 0rem for final, 1.5rem for semi, 3rem for quarter (Handled by team-name component now)
        // Removed spacerHtml calculation
 
        const utilRow = new UtilRow()
            .setFields({
                // Add completion attribute based on progression
                team1: `<team-name name="${team1}" direction="r2l" completion="${progression}"></team-name>`,
                score1: score1,
                rank1: isTeam1Last ? 'X' : '',
                stage: row.stage ? abbreviateStage(row.stage) : 'N/A',
                rank2: isTeam2Last ? 'X' : '',
                score2: score2,
                // Add completion attribute based on progression
                team2: `<team-name name="${team2}" completion="${progression}"></team-name>`,
                // Removed spacer field
            })
            .setStyle('team1', {
                'font-weight': 'bold',
                'color': originalStyles.team1.textColor,
                ...team1Style
            })
            .setStyle('team2', {
                'font-weight': 'normal',
                'color': originalStyles.team2.textColor,
                ...team2Style
            })
            .setStyle('score1', {
                'font-weight': 'bold',
                'color': score1ExtraClass
            })
            .setStyle('score2', {
                'font-weight': 'normal',
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
            })
            .setRawData(row); // Store the original row data

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

    html += `
    </div>
    <script>
        (function() {
            const tables = document.querySelectorAll('#knockout-fixtures .fixtures-table');
            tables.forEach(table => {
                table.addEventListener('click', function(event) {
                    const clickedRow = event.target.closest('tr.clickable-row');
                    if (clickedRow) {
                        const fixtureDataString = clickedRow.getAttribute('data-fixture');
                        if (fixtureDataString) {
                            try {
                                const fixtureData = JSON.parse(fixtureDataString);
                                console.log('Clicked Fixture Data:', fixtureData);
                            } catch (e) {
                                console.error('Error parsing fixture data from row:', e, fixtureDataString);
                            }
                        }
                    }
                });
            });
        })();
    </script>
    `;
    return html;
};
