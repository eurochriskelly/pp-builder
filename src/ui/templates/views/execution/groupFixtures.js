const { processTeamName } = require('../../../utils');

module.exports = function generateGroupFixturesView(data) {

  // Build the HTML page
  let html = generateHTMLHeader('Group Fixtures');

  // Build table
  const headers = ['ID', '👥', 'Pitch', '🕒', 'Team 1', 'Score', 'Team 2', 'Score', 'Umpire'];
  html += '<table>';

  let currentCategory = null;

  data.forEach(row => {
      if (row.category !== currentCategory) {
          currentCategory = row.category;
          // Add a header row spanning all columns for the new category
          html += `
              <tr>
                  <th colspan="${headers.length}" style="background-color: #d3d3d3; text-align: center;">
                      ${currentCategory}
                  </th>
              </tr>
              <tr>
                  ${headers.map(header => header === 'ID' ? `<th class="id-column">${header}</th>` : `<th>${header}</th>`).join('')}
              </tr>
          `;
      }

      // Determine if the row should be bold (if started is true)
      const rowStyle = row.started === 'true' ? 'font-weight:bold;' : '';

      html += `<tr style="${rowStyle}">`;

      // ID column
      let idCell = row.id ? row.id.toString().slice(-3) : 'N/A';
      html += `<td style="background-color: lightblue;">${idCell}</td>`;
      html += `<td>${row.g || 'N/A'}</td>`;
      html += `<td>${row.pitch || 'N/A'}</td>`;
      html += `<td>${row.scheduledTime || 'N/A'}</td>`;

      // Team names processing
      let { teamName: team1Name, teamStyle: team1Style } = processTeamName(row.team1);
      let { teamName: team2Name, teamStyle: team2Style } = processTeamName(row.team2);

      // Score processing
      const team1Score = formatScore(row.goals1, row.points1)
      const team2Score = formatScore(row.goals2, row.points2)

      const score1Style = team1Score === 'N/A' ? 'color:grey;' : '';
      const score2Style = team2Score === 'N/A' ? 'color:grey;' : '';

      html += `<td style="${team1Style}">${team1Name || 'N/A'}</td>`;
      html += `<td style="${score1Style}">${team1Score}</td>`;
      html += `<td style="${team2Style}">${team2Name || 'N/A'}</td>`;
      html += `<td style="${score2Style}">${team2Score}</td>`;
      let { teamName: umpireTeamName, teamStyle: umpireTeamStyle } = processTeamName(row.umpireTeam);
      html += `<td style="${umpireTeamStyle}">${umpireTeamName || 'N/A'}</td>`;
      html += '</tr>';
  });

  html += '</table>';
  html += generateHTMLFooter();
  return html
};
