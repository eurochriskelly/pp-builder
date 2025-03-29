const { allowedViews } = require('../../config/allowedViews');

function generateEventManager(tournamentId, uuid, tournament, isLoggedIn = false) {
    // Use CSS classes instead of inline styles
    let html = '<div id="event-manager" class="event-manager-container">'; 
    // Restore mx-auto for centering (assuming Tailwind is active)
    html += `<div class="event-manager-header">
                <h2 class="mx-auto">${tournament.Title || tournament.title || 'Event'}</h2>
                <p class="text-3xl m-4 mb-8 mx-auto">${tournament.Date ? tournament.Date.substring(0,10) : tournament.date || ''} | ${tournament.Location || tournament.location || ''}</p>
             </div>`;
    html += '<nav class="event-manager-nav competition-nav mb-4">';
    html += '<div class="event-manager-nav-inner">';
    html += '<span class="mr-4 font-semibold">Competitions:</span>';

    // Generate links for Competitions
    console.log('Tournament data:', tournament); // Debug logging

    const competitionKeys = tournament.categories ? Object.keys(tournament.categories) : [];
    if (competitionKeys.length > 0) {
        competitionKeys.forEach(compKey => {
            const encodedCompKey = encodeURIComponent(compKey);
            html += `
                <a href="/event/${uuid}/${encodedCompKey}"
                   hx-get="/event/${uuid}/${encodedCompKey}/summary"
                   hx-target="#competition-content"
                   hx-swap="innerHTML"
                   class="event-manager-link competition-link">
                    ${compKey}
                </a>`;
        });
    } else {
        html += '<div class="text-gray-500 p-4 bg-yellow-50 rounded">';
        html += '<p>No competitions found in tournament data.</p>';
        if (tournament.categories === undefined) {
            html += '<p class="text-sm">(Categories data is undefined)</p>';
        } else if (tournament.categories === null) {
            html += '<p class="text-sm">(Categories data is null)</p>';
        } else if (typeof tournament.categories !== 'object') {
            html += `<p class="text-sm">(Categories is type: ${typeof tournament.categories})</p>`;
        }
        html += '</div>';
    }

    html += '</div></nav>';

    // Add container for competition-specific content
    html += '<div id="competition-content" class="competition-content-container p-4 border-t border-gray-200">';
    html += '<p class="text-gray-600">Select a competition above to view details.</p>';
    html += '</div>';
    html += '</div>';

    if (isLoggedIn) {
        html += `<script src="/scripts/tournamentSelectionScripts.js"></script>`;
    }

    return html;
}

module.exports = { generateEventManager };
