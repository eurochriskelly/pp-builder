const { createTournamentRow } = require('../../../public/scripts/webcomponents/tournament-row.js');

module.exports = function generateTournamentSelection(tournaments, isLoggedIn = false) {
  // Basic modal styles (can be moved to CSS)
  const modalStyle = `
    position: fixed; 
    top: 50%; 
    left: 50%; 
    transform: translate(-50%, -50%); 
    background-color: white; 
    padding: 2rem; 
    border-radius: 0.5rem; 
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); 
    z-index: 50; 
    max-height: 90vh; 
    overflow-y: auto;
    min-width: 300px; /* Ensure minimum width */
  `;
  // Basic overlay styles (can be moved to CSS)
  const overlayStyle = `
    position: fixed; 
    top: 0; 
    left: 0; 
    width: 100%; 
    height: 100%; 
    background-color: rgba(0, 0, 0, 0.5); 
    z-index: 40;
  `;


  let html = `
    <div id="tournament-selection" class="p-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">Select a Tournament</h2>
        ${isLoggedIn ? `
          <button 
            hx-get="/create-tournament-form" 
            hx-target="#create-tournament-modal-content" 
            hx-swap="innerHTML" 
            onclick="document.getElementById('create-tournament-modal').style.display='block'"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            title="Create New Tournament"
          >
            +
          </button>
        ` : ''}
      </div>
      
      <!-- Modal Container -->
      <div id="create-tournament-modal" style="display: none;">
        <div style="${overlayStyle}" onclick="this.parentNode.style.display='none'; document.getElementById('create-tournament-modal-content').innerHTML='';"></div>
        <div id="create-tournament-modal-content" style="${modalStyle}">
          <!-- Form will be loaded here -->
        </div>
      </div>

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
    <script src="/scripts/tournamentSelection.public.js"></script>
  `;
  return html;
};
