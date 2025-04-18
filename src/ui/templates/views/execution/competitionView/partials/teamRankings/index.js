/*
  Team Ranking page shows the ranking and progression of each team in a given competition.
  It shows the teams in a table with the following columns:
  - Rank
  - Team Name
  - GP (Group Play)
  - SF (Semi-Final)  
  - QF (Quarter-Final)
  - 3/4 (3rd/4th Place) 
  - F (Final)

  Note the columns will vary depending on the competition type (e.g. knockout, league, etc.)
*/

/*
   parameters:
    - rank: the rank of the team (1, 2, 3...)
    - teamName: the name of the team (uses <team-name> webcomponent)
    - maxColumns: the max number of columns to display
    - contest: the contest type (e.g. plate, cup, etc.)
    - columns: the columns to display for this row (e.g. GP, SF, QF, 3/4, F)
      - The columns are provided and should all be the same size
      - The matches should be assigned to the relevant column
   teamMatches: [
    {
      matchId: '123456',
      teamVersus: 'Team B',
      column: 'GP',
      group: 1,
      position: 3,
      matchNum: 1,
      matchOutcome: 'won',
      goals: 2,
      points: 3,
      goalsAgainst: 1,    
      pointsAgainst: 0,
     },
     {
      matchId: '123456',
      teamVersus: 'Team C',
      column: 'QF',
      contest: 'cup',
      group: 1,
      matchNum: 1,
      matchOutcome: 'won',
      goals: 2,
      points: 3,
      goalsAgainst: 1,    
      pointsAgainst: 0,
     }
   ]

 */
function generateTeamRankingsRow(rank, teamName, contest, maxColumns, columns, teamMatches=[]) {
    const html = ['<tr>'];
    
    // Add rank cell
    html.push(`<td class="px-4 py-2 text-center">${rank}</td>`);
    
    // Add team name cell
    html.push(`<td class="px-4 py-2"><team-name>${teamName}</team-name></td>`);
    
    // Generate match cells for each column
    columns.forEach(column => {
        const matches = teamMatches.filter(match => match.column === column);
        const cellContent = matches.map(match => {
            const outcome = match.matchOutcome;
            const score = `${match.goals}-${match.points}`;
            return `
                <div class="match ${outcome}" data-match-id="${match.matchId}">
                    <span class="score">${score}</span>
                    <span class="versus">${match.teamVersus}</span>
                </div>`;
        }).join('');
        
        html.push(`<td class="px-4 py-2">${cellContent || ''}</td>`);
    });
    
    html.push('</tr>');
    return html.join('');
}

module.exports = generateTeamRankingsRow;