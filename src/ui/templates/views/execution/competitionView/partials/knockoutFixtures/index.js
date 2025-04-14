const { UtilTable, UtilRow, ScoreData } = require('../../../../../partials/tableUtils');
const { processTeamName } = require('../../../../../../utils');
const { formatCategory } = require('../../../../../../utils/categoryFormatter');
// abbreviateStage might still be used elsewhere, but removed from the stage field generation
const { parseStageToLevel, abbreviateStage } = require('../../../../../../utils/stageParser'); 
const {
  getScoreComparisonClasses,
  getFinalScoreDisplay,
  getMatchOutcomeStyles,
} = require('../../../../../partials/scoreUtils');

// Define the desired order for tournament parts
const tournamentPartOrder = ['cup', 'shield', 'plate'];

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
        team1: { label: 'Team 1', align: 'left', width: `auto` },
        score1: { label: 'Score 1', align: 'center', width: '80px' },
        rank1: { label: 'X', align: 'left', width: '2%' },
        stage: {
            label: 'Stage',
            align: 'center', width: '30px',
        }, // Increase width to match score columns
        rank2: { label: 'X', align: 'right', width: '2%' },
        score2: { label: 'Score 2', align: 'center', width: '80px' },
        team2: { label: 'Team 2', align: 'left', width: `auto` }
    })
    .noHeader();

    // First group fixtures by tournament part (CUP, SHD, etc)
    const fixturesByTournamentPart = {};
    categoryData.forEach(row => {
        const stageParts = row.stage?.split('_') || [];
        const tournamentPart = stageParts[0]?.trim().toLowerCase() || 'unknown';
        if (!fixturesByTournamentPart[tournamentPart]) {
            fixturesByTournamentPart[tournamentPart] = [];
        }
        fixturesByTournamentPart[tournamentPart].push({
            ...row,
            stageLevel: parseStageToLevel(row.stage)
        });
    });

    // Sort each tournament part's fixtures by stage level
    for (const tournamentPart in fixturesByTournamentPart) {
        fixturesByTournamentPart[tournamentPart].sort((a, b) => a.stageLevel - b.stageLevel);
    }

    // Get sorted tournament part keys based on predefined order
    const sortedTournamentParts = Object.keys(fixturesByTournamentPart).sort((a, b) => {
        const indexA = tournamentPartOrder.indexOf(a.toLowerCase()); // Ensure lowercase comparison for keys
        const indexB = tournamentPartOrder.indexOf(b.toLowerCase()); // Ensure lowercase comparison for keys

        if (indexA !== -1 && indexB !== -1) return indexA - indexB; // Both in predefined order
        if (indexA !== -1) return -1; // Only A is predefined, comes first
        if (indexB !== -1) return 1;  // Only B is predefined, comes first
        return a.localeCompare(b); // Neither predefined, sort alphabetically
    });

    // Process each tournament part's fixtures together in the sorted order
    let rowIndex = 0;


    for (const tournamentPart of sortedTournamentParts) { // Iterate using sorted keys
        const fixtures = fixturesByTournamentPart[tournamentPart];
        if (!fixtures || fixtures.length === 0) continue; // Skip empty parts

        const tournamentPartDisplay = tournamentPart.toUpperCase();
        table.fullHeader(tournamentPartDisplay, { position: 'before', rowIndex });

        fixtures.forEach(row => {
            const stageParts = row.stage?.split('_') || []; // Define stageParts based on current row
            const { teamName: team1Name, teamStyle: team1Style } = processTeamName(row.team1);
            const { teamName: team2Name, teamStyle: team2Style } = processTeamName(row.team2);

            // Team won calculations for determining order
            const team1Won = row.outcome === 'played' && 
                (row.goals1 * 3 + row.points1) > (row.goals2 * 3 + row.points2);
            const team2Won = row.outcome === 'played' && 
                (row.goals2 * 3 + row.points2) > (row.goals1 * 3 + row.points1);

            // Only swap display order if team2 won and it's a played match
            let team1 = row.team1;
            let team2 = row.team2;
            let goals1 = row.goals1;
            let points1 = row.points1;
            let goals2 = row.goals2;
            let points2 = row.points2;

            // Only swap display order if team2 won and it's a played match
            if (row.outcome === 'played' && team2Won) {
                [team1, team2] = [team2, team1];
                [goals1, points1, goals2, points2] = [goals2, points2, goals1, points1];
            }

            // Get styles for team names based on original team order
            const originalStyles = getMatchOutcomeStyles(
                new ScoreData(row.goals1, row.points1, row.outcome),
                new ScoreData(row.goals2, row.points2, row.outcome)
            );

            // Check if this is each team's last match
            const isTeam1Last = teamLastFixtures.some(f => f.team === team1 && f.lastFixture === row);
            const isTeam2Last = teamLastFixtures.some(f => f.team === team2 && f.lastFixture === row);

            // Determine round and progression based on stage
            // Use stageParts defined within this loop scope
            const roundName = stageParts[0]?.toLowerCase() || ''; // Ensure lowercase for comparison
            let progression = 0;

            if (roundName === 'cup') round = 0;
            else if (roundName === 'shield') round = 3;
            else if (roundName === 'plate') round = 6;

            const hierarchyPart = stageParts[1]?.toLowerCase() || '';
            if (hierarchyPart.includes('final')) {
                progression = 1;
            } else if (hierarchyPart.includes('semi') ||
                hierarchyPart.includes('3rd4th')) { // 3rd/4th playoff is level 2
                progression = 2;
            } else if (hierarchyPart.includes('quarter') ||
                hierarchyPart.includes('4th5th') ||
                hierarchyPart.includes('5th6th') ||
                hierarchyPart.includes('6th7th') ||
                hierarchyPart.includes('7th8th')) {
                progression = 3; // Quarter-finals and other playoffs are level 3
            } else {
                progression = 0; // Default for unknown stages
            }
 
            // Calculate indent width for staggered display (earlier rounds = more indent)
            // progression: 1=final, 2=semi, 3=quarter/playoffs
            // indent: 0rem for final, 1.5rem for semi, 3rem for quarter (Handled by team-name component now)
            // Removed spacerHtml calculation
            // Create score data objects for table compatibility
            const score1Data = new ScoreData(goals1, points1, row.outcome);
            const score2Data = new ScoreData(goals2, points2, row.outcome);

            // Create HTML components for the actual rendering - REMOVE inline style
            const score1Html = `<gaelic-score goals="${goals1}" points="${points1}" layout="over" scale="0.75" played="${row.outcome === 'played'}" goalsagainst="${goals2}" pointsagainst="${points2}"></gaelic-score>`;
            const score2Html = `<gaelic-score goals="${goals2}" points="${points2}" layout="over" scale="0.75" played="${row.outcome === 'played'}" goalsagainst="${goals1}" pointsagainst="${points1}"></gaelic-score>`;

            // Add a custom property to ScoreData that will be used for rendering
            score1Data.customHtml = score1Html;
            score2Data.customHtml = score2Html;
            const w = '100%';
            const utilRow = new UtilRow()
                .setFields({
                    team1: `
                    <div style="display: flex; justify-content: flex-end; align-items: center; width: ${w};min-width:${w};max-width:${w}">
                        <team-name name="${team1}" direction="r2l" completion="${progression}" ></team-name>
                    </div>
                    `,
                    score1: score1Data, // Use the ScoreData object with custom HTML
                    rank1: isTeam1Last ? 'X' : '',
                    stage: `<knockout-level 
                                match-id="${row.id || ''}" 
                                stage="${row.stage || ''}" 
                                stage-level="${row.stageLevel || ''}" 
                                category="${row.category || ''}">
                             </knockout-level>`,
                    rank2: isTeam2Last ? 'X' : '',
                    score2: score2Data, // Use the ScoreData object with custom HTML
                    team2: `
                    <div style="display: flex; align-items: left; width: ${w};min-width:${w};max-width:${w}">
                        <team-name name="${team2}" completion="${progression}" ></team-name>
                    </div>
                    `,
                })
                .setStyle('team1', {
                    'font-weight': 'bold',
                    'color': originalStyles.team1.textColor,
                    ...team1Style
                })
                .setStyle('stage', {
                    'max-width': '60px',
                    'margin': '0',
                    'padding': '0',
                })
                .setStyle('team2', {
                    'font-weight': 'normal',
                    'color': originalStyles.team2.textColor,
                    ...team2Style
                })
                .setStyle('score1', { // Apply text-align center
                    'max-width': '46px',
                    'padding': '0',
                    'text-align': 'center',
                    'vertical-align': 'middle' // Keep vertical align
                })
                .setStyle('score2', { // Apply text-align center
                    'max-width': '46px',
                    'padding': '0',
                    'text-align': 'center',
                    'vertical-align': 'middle' // Keep vertical align
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
                .setRawData(row); // Store the original row data

            table.addRow(utilRow);
        }); // end fixtures.forEach

        rowIndex += fixtures.length;
    } // end for..of sortedTournamentParts

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

    // Sort each category's matches by stage level (lowest first - reverse order)
    for (const category in groupedData) {
        groupedData[category].sort((a, b) => a.stageLevel - b.stageLevel);
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
    <script src="/scripts/knockoutFixtures.public.js"></script>
    `;
    return html;
};
