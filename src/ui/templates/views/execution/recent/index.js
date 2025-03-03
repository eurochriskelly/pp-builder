const { processTeamName } = require('../../../../utils');
const { generateRecentRow } = require('./partials/utils');

module.exports = function generateRecentView(data, count) {
  let html = `<h2>Number of matches started: ${count}</h2>`;
  html += '<div id="recent-table">';
  html += '<table><tr>';
  const headers = ['ID', 'Start', 'Pitch', '👥', 'Stage', 'Competition', 'Team 1', 'Score 1', 'Team 2', 'Score 2', 'Umpire Team'];
  html += headers.map(header => header === 'ID' ? `<th class="id-column">${header}</th>` : `<th>${header}</th>`).join('');
  html += '</tr>';
  
  data.forEach(row => {
    html += generateRecentRow(row);
  });
  
  html += '</table>';
  html += '</div>';
  return html;
};
