// src/ui/templates/views/planning/matches/index.js
const { createMatchRow } = require('../../../../public/scripts/webcomponents/match-row.js');

module.exports = function generateMatchesPlanning(data) {
  let html = `
    <div id="planning-matches" class="p-4">
      <h2 class="text-2xl font-bold mb-2">Simulate running tournament</h2>
      <p class="text-gray-700 mb-4">Simulate tournament scenarios by playing upcoming matches or import fixtures from a CSV.</p>
      <div class="mb-6 flex flex-wrap gap-2 overflow-hidden">
        <button class="bg-red-600 text-white px-4 py-2 rounded" hx-get="/planning/${data.tournamentId}/reset" hx-target="#planning-matches" hx-swap="outerHTML" hx-on::after-request="htmx.ajax('GET', '/planning/${data.tournamentId}', '#planning-matches')">Reset Tournament</button>
        <button class="bg-blue-500 text-white px-4 py-2 rounded" hx-post="/planning/${data.tournamentId}/simulate/1" hx-target="#planning-matches" hx-swap="outerHTML">Play Next Match</button>
        <input type="number" id="play-n-matches-input" min="1" class="w-20 p-2 border rounded" placeholder="N">
        <button onclick="playNextNMatches(document.getElementById('play-n-matches-input').value, '${data.tournamentId}')" class="bg-blue-500 text-white px-4 py-2 rounded ml-2">Play Next N Matches</button>
        <button hx-get="/planning/${data.tournamentId}/import-fixtures" hx-target="body" hx-swap="outerHTML" class="bg-orange-500 text-white px-4 py-2 rounded ml-auto">Import Fixtures</button>
      </div>
  `;

  const upcomingMatches = data.matches.filter(match => match.started === 'false');
  const finishedMatches = data.matches.filter(match => match.started === 'true').sort((a, b) => b.scheduledTime.localeCompare(a.scheduledTime) || b.id - a.id);

  html += `
    <table id="upcoming-table" class="mt-2 w-full border-collapse">
      <tr>
        <th class="p-2 text-left">ID</th>
        <th class="p-2 text-left">Group</th>
        <th class="p-2 text-left">Category</th>
        <th class="p-2 text-left">Stage</th>
        <th class="p-2 text-left">Pitch</th>
        <th class="p-2 text-left">Time</th>
        <th class="p-2 text-left">Team 1</th>
        <th class="p-2 text-left">Team 2</th>
        <th class="p-2 text-left">Umpire</th>
      </tr>
      ${upcomingMatches
        .map((match, index) =>
          createMatchRow({
            id: match.id,
            group: match.grp,
            category: match.category,
            stage: match.stage,
            pitch: match.pitch,
            time: match.scheduledTime,
            team1: match.team1,
            team2: match.team2,
            umpire: match.umpireTeam,
            isUpcoming: 'true',
            tournamentId: data.tournamentId,
            index: index
          })
        )
        .join('')}
    </table>
    ${upcomingMatches.length > 10 ? `
      <div class="mt-2 text-center">
        <a id="show-more-upcoming" href="#" class="text-blue-600 underline" onclick="document.querySelectorAll('#upcoming-table .upcoming-hidden-row').forEach(cell => cell.classList.remove('hidden')); this.classList.add('hidden'); document.getElementById('show-less-upcoming').classList.remove('hidden'); return false;">Show ${upcomingMatches.length - 10} More</a>
        <a id="show-less-upcoming" href="#" class="text-blue-600 underline hidden" onclick="document.querySelectorAll('#upcoming-table .upcoming-hidden-row').forEach(cell => cell.classList.add('hidden')); document.getElementById('show-more-upcoming').classList.remove('hidden'); this.classList.add('hidden'); return false;">Show Less</a>
      </div>
    ` : ''}
  `;

  html += `
    <h2 class="mt-8 text-xl font-bold">Finished Matches</h2>
    <table id="finished-table" class="mt-2 w-full border-collapse">
      <tr>
        <th class="p-2 text-left">ID</th>
        <th class="p-2 text-left">Group</th>
        <th class="p-2 text-left">Category</th>
        <th class="p-2 text-left">Stage</th>
        <th class="p-2 text-left">Pitch</th>
        <th class="p-2 text-left">Time</th>
        <th class="p-2 text-left">Team 1</th>
        <th class="p-2 text-left">Score</th>
        <th class="p-2 text-left">Team 2</th>
        <th class="p-2 text-left">Score</th>
      </tr>
      ${finishedMatches
        .map((match, index) =>
          createMatchRow({
            id: match.id,
            group: match.grp,
            category: match.category,
            stage: match.stage,
            pitch: match.pitch,
            time: match.scheduledTime,
            team1: match.team1,
            team2: match.team2,
            umpire: match.umpireTeam,
            isUpcoming: 'false',
            tournamentId: data.tournamentId,
            index: index,
            team1Score: match.team1Score,
            team2Score: match.team2Score
          })
        )
        .join('')}
    </table>
    ${finishedMatches.length > 10 ? `
      <div class="mt-2 text-center">
        <a id="show-more-finished" href="#" class="text-blue-600 underline" onclick="document.querySelectorAll('#finished-table .finished-hidden-row').forEach(cell => cell.classList.remove('hidden')); this.classList.add('hidden'); document.getElementById('show-less-finished').classList.remove('hidden'); return false;">Show ${finishedMatches.length - 10} More</a>
        <a id="show-less-finished" href="#" class="text-blue-600 underline hidden" onclick="document.querySelectorAll('#finished-table .finished-hidden-row').forEach(cell => cell.classList.add('hidden')); document.getElementById('show-more-finished').classList.remove('hidden'); this.classList.add('hidden'); return false;">Show Less</a>
      </div>
    ` : ''}
  `;

  html += `
    </div>
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
