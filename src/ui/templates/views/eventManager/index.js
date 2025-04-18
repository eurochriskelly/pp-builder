const { allowedViews } = require('../../../config/allowedViews');
// Lucide CDN and web component usage: no need to import Calendar, MapPin

function generateEventManager(uuid, tournament, isLoggedIn = false) {
    // Check if tournament.categories is a non-empty array
    const competitions = Array.isArray(tournament.categories) ? tournament.categories : [];
    let initialLoadAttributes = '';
    let currentCompetition = '';
    
    if (competitions.length > 0) {
        currentCompetition = competitions[0]; // Default to first competition
        const encodedFirstCompName = encodeURIComponent(currentCompetition);
        const initialLoadUrl = `/event/${uuid}/competition-update?competition=${encodedFirstCompName}`;
        initialLoadAttributes = `
            hx-get="${initialLoadUrl}"
            hx-trigger="load"
            hx-target="#content"
            hx-swap="innerHTML"
            data-current-competition="${currentCompetition}"
        `;
    }

    // Use CSS classes instead of inline styles
    // Add initial load attributes if competitions exist
    let html = `<div id="event-manager" class="event-manager-container"
        ${initialLoadAttributes}
    >`;
    html += `<div class="event-manager-header">
                <h2 class="mx-auto event-info-title">
                    <span>${tournament.Title || tournament.title || 'Event'}</span>
                    <span class="event-info-icon" style="float: right;">
                        <i data-lucide="toggle-left" class="toggle-icon" style="transform: scale(1.5);" onclick="toggleIcon(this)"></i>
                    </span>
                </h2>
                <p class="text-3xl m-4 mb-8 mx-auto">
                    <span class="inline-icon-text">
                        <span class="icon"><i data-lucide="calendar" style="transform: scale(1.5);"></i></span>
                        ${tournament.Date ? tournament.Date.substring(0, 10) : tournament.date || ''}
                    </span>
                    <span class="mx-2">|</span>
                    <span class="inline-icon-text">
                        <span class="icon"><i data-lucide="map-pin" style="transform: scale(1.5);"></i></span>
                        ${tournament.Location || tournament.location || ''}
                    </span>
                </p>
             </div>`;

    // Add the toggleIcon function to handle the icon toggle
    html += `<script>
             </script>`;

    html += '<nav class="event-manager-nav competition-nav mb-4 mt-4">';
    html += '  <div class="mr-4 mt-4 font-semibold">Competitions:</div>'; // Keep "Competitions:" text directly inside <nav>
    html += '  <div class="competition-links-container">'; // Add a container div for the links

    // Generate links for Competitions
    if (competitions.length > 0) {
        competitions.forEach(compName => {
            const encodedCompName = encodeURIComponent(compName);
            const updateUrl = `/event/${uuid}/competition-update?competition=${encodedCompName}`;
            // Add a selected-competition class when this is the current competition
            const isSelected = compName === currentCompetition ? ' selected-competition' : '';
            html += `
                <a href="#"
                   hx-get="${updateUrl}"
                   hx-target="#content"
                   hx-swap="innerHTML"
                   hx-trigger="click"
                   class="event-manager-link competition-link${isSelected}"
                   data-competition-name="${compName}">
                    ${compName}
                </a>`;
        });
    } else {
        // Updated error handling for clarity
        html += '<div class="text-gray-500 p-4 bg-yellow-50 rounded">';
        html += '<p>No competitions found in tournament data.</p>';
        if (tournament.categories === undefined) {
            html += '<p class="text-sm">(Reason: tournament.categories is undefined)</p>';
        } else if (tournament.categories === null) {
            html += '<p class="text-sm">(Reason: tournament.categories is null)</p>';
        } else if (!Array.isArray(tournament.categories)) {
             html += `<p class="text-sm">(Reason: Expected tournament.categories to be an array, but got type: ${typeof tournament.categories})</p>`;
        } else { // It is an array, but empty
             html += '<p class="text-sm">(Reason: tournament.categories is an empty array)</p>';
        }
        html += '</div>';
    }

    html += '  </div>'; // Close competition-links-container
    html += '</nav>';
    html += '</div>'; // Close event-manager-container

    html += `<link rel="stylesheet" href="/styles/eventManager.style.css" />`;
    // Lucide web component CDN and initialization
    html += `<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>`;
    html += `<script>lucide.createIcons();</script>`;

    // Add the JavaScript for competition selection highlighting and make it work after HTMX swaps
    html += `<script src="/scripts/eventManager.public.js"></script>`;

    return html;
}

module.exports = { generateEventManager };
