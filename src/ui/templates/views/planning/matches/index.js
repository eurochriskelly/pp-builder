const { processTeamName, formatScore } = require('../../../../utils');
const {
  generateTable
} = require('./partials/utils');

module.exports = function generateMatchesPlanning(data) {
  let html = '<div id="planning-matches">';
  html += '<h2>Simulate running tournament</h2>';
  html += '<p>Simulate tournament scenarios by playing upcoming matches or import fixtures from a CSV.</p>';

  html += '<div style="margin-bottom: 20px; overflow: hidden;">';
  html += '<button style="background-color: #e74c3c; color: white;" hx-get="/planning/' + data.tournamentId + '/reset" hx-target="#planning-matches" hx-swap="outerHTML" hx-trigger="click" hx-on::after-request="htmx.ajax(\'GET\', \'/planning/' + data.tournamentId + '\', \'#planning-matches\')">Reset Tournament</button> ';
  html += '<button hx-post="/planning/' + data.tournamentId + '/simulate/1" hx-target="#planning-matches" hx-swap="outerHTML">Play Next Match</button> ';
  html += `<input type="number" id="play-n-matches-input" min="1" style="width: 80px; margin-left: 10px; padding: 8px;" placeholder="N"> `;
  html += `<button onclick="playNextNMatches(document.getElementById('play-n-matches-input').value, '${data.tournamentId}')" style="margin-left: 5px;">Play Next N Matches</button>`;
  html += '<button hx-get="/planning/' + data.tournamentId + '/import-fixtures" hx-target="body" hx-swap="outerHTML" style="background-color: #e67e22; color: white; margin-left: 10px; float: right;">Import Fixtures</button>';
  html += '</div>';

  // Split matches into upcoming and finished with deterministic sorting
  const upcomingMatches = data.matches
    .filter(match => match.started === 'false')
    .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime) || a.id - b.id);
  const finishedMatches = data.matches
    .filter(match => match.started === 'true')
    .sort((a, b) => b.scheduledTime.localeCompare(a.scheduledTime) || b.id - a.id);
  const totalMatches = data.matches.length;

  // Generate tables using the new utility function
  const upcomingHeaders = ['ID', 'Group', 'Category', 'Stage', 'Pitch', 'Time', 'Team 1', 'Team 2', 'Umpire'];
  html += generateTable('UPCOMING GAMES', upcomingHeaders, upcomingMatches, data.tournamentId, true, totalMatches);

  const finishedHeaders = ['ID', 'Group', 'Category', 'Stage', 'Pitch', 'Time', 'Team 1', 'Score', 'Team 2', 'Score'];
  html += generateTable('FINISHED GAMES', finishedHeaders, finishedMatches, data.tournamentId, false, totalMatches);

  html += '</div>';

  html += `
    <script>
      async function playNextNMatches(n, tournamentId) {
        for (let i = 0; i < n; i++) {
          await htmx.ajax('POST', '/planning/' + tournamentId + '/simulate/1', {
            target: '#planning-matches',
            swap: 'outerHTML'
          });
        }
      }
    </script>
  `;

  return html;
};
