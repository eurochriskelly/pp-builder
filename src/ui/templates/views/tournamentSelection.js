const { createTournamentRow } = require('../../public/scripts/webcomponents/tournament-row.js');

module.exports = function generateTournamentSelection(tournaments, isLoggedIn = false) {
  let html = `
    <div id="tournament-selection" class="p-4">
      <h2 class="text-2xl font-bold mb-4">Select a Tournament</h2>
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
            .sort((a, b) => {
              return a.Id > b.Id ? -1 : a.Id < b.Id ? 1 : 0
            })
            .map(t =>
              createTournamentRow({
                id: t.Id,
                title: t.Title || t.title,
                date: t.Date || t.date,
                location: t.Location || t.location,
                eventUuid: t.eventUuid,
                isLoggedIn
              })
            )
            .join('')}
        </table>
      </div>
    </div>
    <script src="/scripts/tournamentSelectionScripts.js"></script>
  `;
  return html;
};
