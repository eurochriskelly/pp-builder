module.exports = function generateTournamentSelection(tournaments, isLoggedIn = false) {
  let html = '<div id="tournament-selection" class="p-4">';
  html += '<h2 class="text-2xl font-bold mb-4">Select a Tournament</h2>';
  if (isLoggedIn) {
    html += `
      <div class="mb-6">
        <button hx-get="/create-tournament" hx-target="body" hx-swap="outerHTML" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Create Tournament</button>
      </div>
    `;
  }
  html += '<table class="w-full border-collapse">';
  html += '<tr><th class="p-2 bg-gray-200">ID</th><th class="p-2 bg-gray-200">Title</th><th class="p-2 bg-gray-200">Date</th><th class="p-2 bg-gray-200">Location</th>' + 
          (isLoggedIn ? '<th class="p-2 bg-gray-200">Planning</th><th class="p-2 bg-gray-200">Execution</th><th class="p-2 bg-gray-200">Share</th>' : '') + '</tr>';
  tournaments
    .sort((a, b) => (a.Date > b.Date) ? -1 : ((a.Date < b.Date) ? 1 : 0))
    .forEach(t => {
      const eventUuid = t.eventUuid || 'N/A';
      html += '<tr>';
      html += `<td class="p-2">${t.Id}</td>`;
      html += `<td class="p-2">${t.Title || t.title || 'N/A'}</td>`;
      html += `<td class="p-2">${t.Date.substring(0, 10) || t.date || 'N/A'}</td>`;
      html += `<td class="p-2">${t.Location || t.location || 'N/A'}</td>`;
      if (isLoggedIn) {
        html += `<td class="p-2"><button hx-get="/planning/${t.Id}" hx-target="body" hx-swap="outerHTML" class="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">Planning</button></td>`;
        html += `<td class="p-2"><button hx-get="/execution/${t.Id}/recent" hx-target="body" hx-swap="outerHTML" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Execution</button></td>`;
        html += `
          <td class="p-2">
            <button id="copy-link-btn-${eventUuid}" onclick="copyEventLink('${eventUuid}')" class="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600">
              Copy Link
            </button>
          </td>`;
      }
      html += '</tr>';
    });
  html += '</table>';
  html += '</div>';
  
  html += `<script src="/scripts/tournamentSelectionScripts.js"></script>`;

  return html;
};
