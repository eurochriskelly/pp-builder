const { processTeamName, formatScore } = require('../../../../utils');
const { generateTable } = require('./partials/utils');

module.exports = function generateMatchesPlanning(data) {
  let html = '<div id="planning-matches" class="p-4">';
  html += '<h2 class="text-2xl font-bold mb-2">Simulate running tournament</h2>';
  html += '<p class="text-gray-700 mb-4">Simulate tournament scenarios by playing upcoming matches or import fixtures from a CSV.</p>';

  html += '<div class="mb-6 flex flex-wrap gap-2 overflow-hidden">';
  html += '<button class="bg-red-600 text-white px-4 py-2 rounded" hx-get="/planning/' + data.tournamentId + '/reset" hx-target="#planning-matches" hx-swap="outerHTML" hx-trigger="click" hx-on::after-request="htmx.ajax(\'GET\', \'/planning/' + data.tournamentId + '\', \'#planning-matches\')">Reset Tournament</button>';
  html += '<button class="bg-blue-500 text-white px-4 py-2 rounded" hx-post="/planning/' + data.tournamentId + '/simulate/1" hx-target="#planning-matches" hx-swap="outerHTML">Play Next Match</button>';
  html += '<input type="number" id="play-n-matches-input" min="1" class="w-20 p-2 border rounded" placeholder="N">';
  html += `<button onclick="playNextNMatches(document.getElementById('play-n-matches-input').value, '${data.tournamentId}')" class="bg-blue-500 text-white px-4 py-2 rounded ml-2">Play Next N Matches</button>`;
  // Fixed upload button - ensured proper HTMX attributes and styling
  html += '<button hx-get="/planning/' + data.tournamentId + '/import-fixtures" hx-target="body" hx-swap="outerHTML" class="bg-orange-500 text-white px-4 py-2 rounded ml-auto">Import Fixtures</button>';
  html += '</div>';

  // Get matches in API's nextup order
  // Primary sort by scheduledTime, then use nextup order as secondary sort
  const upcomingMatches = data.matches
    .filter(match => match.started === 'false')

  const finishedMatches = data.matches
    .filter(match => match.started === 'true')
    .sort((a, b) => b.scheduledTime.localeCompare(a.scheduledTime) || b.id - b.id);
  const totalMatches = data.matches.length;

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
