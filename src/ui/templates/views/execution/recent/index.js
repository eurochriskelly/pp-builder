const {
  generateTableCell,
  generateIdCell,
  generateTeamCell,
  generateScoreCell,
  generateTable
} = require('../../../partials/tableUtils');

// This function now serves as the rowGenerator for generateTable
function generateRecentRow(row) {
  let html = '<tr>';
  html += generateIdCell(row.id);
  html += generateTableCell(row.start);
  html += generateTableCell(row.pitch);
  html += generateTableCell(row.grp); // Assuming '👥' corresponds to 'grp'
  html += generateTableCell(row.stage);
  html += generateTableCell(row.competition, 'comp-column'); // Add class for potential targeting
  html += generateTeamCell(row.team1);
  html += generateScoreCell(row.goals1, row.points1); // Assuming score1 maps to goals1, points1
  html += generateTeamCell(row.team2);
  html += generateScoreCell(row.goals2, row.points2); // Assuming score2 maps to goals2, points2
  html += generateTeamCell(row.umpireTeam);
  html += '</tr>';
  return html;
}

module.exports = function generateRecentView(data, count) {
  let html = `<h2>Number of matches started: ${count}</h2>`;
  
  const headersConfig = [
    { key: 'id', label: 'ID', className: 'id-column' },
    { key: 'start', label: 'Start' },
    { key: 'pitch', label: 'Pitch' },
    { key: 'grp', label: '👥' },
    { key: 'stage', label: 'Stage' },
    { key: 'competition', label: 'Comp', className: 'comp-column' },
    { key: 'team1', label: 'Team 1' },
    { key: 'score1', label: 'Score 1' },
    { key: 'team2', label: 'Team 2' },
    { key: 'score2', label: 'Score 2' },
    { key: 'umpireTeam', label: 'Umpire Team' }
  ];

  html += '<div id="recent-table">';
  html += generateTable({
      data: data,
      headersConfig: headersConfig,
      rowGenerator: generateRecentRow, // Pass the existing function
      tableClassName: '', // Add classes if needed
      emptyDataMessage: 'No recent matches found.'
  });
  html += '</div>';
  
  return html;
};
