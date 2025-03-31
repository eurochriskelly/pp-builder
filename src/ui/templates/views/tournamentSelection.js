// src/ui/templates/views/tournamentSelection.js
module.exports = function generateTournamentSelection(tournaments, isLoggedIn = false) {
  let html = `
    <div id="tournament-selection" class="p-4">
      <h2 class="text-2xl font-bold mb-4">Select a Tournament</h2>
      ${isLoggedIn ? `
        <div class="m-6">
          <button hx-get="/create-tournament" hx-target="body" hx-swap="outerHTML" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-3 m-4">Create Tournament</button>
        </div>
      ` : ''}
      <div class="m-3">
        <table class="w-full border-collapse m-3">
          <tr>
            <th class="p-2 bg-gray-200">ID</th>
            <th class="p-2 bg-gray-200">Title</th>
            <th class="p-2 bg-gray-200">Date</th>
            <th class="p-2 bg-gray-200">Location</th>
            ${isLoggedIn ? '<th class="p-2 bg-gray-200">Planning</th><th class="p-2 bg-gray-200">Execution</th><th class="p-2 bg-gray-200">Share</th>' : ''}
          </tr>
          ${tournaments
            .sort((a, b) => (a.Date > b.Date) ? -1 : ((a.Date < b.Date) ? 1 : 0))
            .map(t => `
              <tournament-row
                id="${t.Id}"
                title="${t.Title || t.title || 'N/A'}"
                date="${t.Date || t.date || ''}"
                location="${t.Location || t.location || 'N/A'}"
                event-uuid="${t.eventUuid || 'N/A'}"
                is-logged-in="${isLoggedIn}"
              ></tournament-row>
            `).join('')}
        </table>
      </div>
    </div>
    <script src="/scripts/tournamentSelectionScripts.js"></script>
    <script src="/scripts/webcomponents/tournament-row.js" defer></script>
  `;
  return html;
};

