// Lucide CDN and web component usage: no need to import Calendar, MapPin

function escapeAttribute(value = '') {
    return `${value}`.replace(/"/g, '&quot;');
}

function generateEventManager(uuid, tournament, loggedIn = false, editable = false) {
    // Check if tournament.categories is a non-empty array
    const competitions = Array.isArray(tournament.categories) ? tournament.categories : [];
    let initialLoadAttributes = '';
    let currentCompetition = '';
    
    if (competitions.length > 0) {
        currentCompetition = competitions[0]; // Default to first competition
        const encodedFirstCompName = encodeURIComponent(currentCompetition);
        const initialLoadUrl = `/event/${uuid}/competition-update${editable ? '/edit' : ''}?competition=${encodedFirstCompName}`;
        initialLoadAttributes = `
            data-default-competition="${escapeAttribute(currentCompetition)}"
            data-default-url="${initialLoadUrl}"
            data-content-target="#content"
            data-editable="${editable ? 'true' : 'false'}"
            data-event-uuid="${escapeAttribute(uuid)}"
            data-preference-cookie="preferredCompetition"
        `;
    }

    // Use CSS classes instead of inline styles
    // Add initial load attributes if competitions exist
    let html = `<div id="event-manager" class="event-manager-container"
        ${initialLoadAttributes}
    >`;
    html += `<div class="event-manager-header">
                <h2 class="m-0 p-3 event-info-title" style="margin-bottom:0">
                    <span>${tournament.Title || tournament.title || 'Event'}</span>
                    <span class="event-info-icon" style="float: right;">
                    </span>
                </h2>
                <div class="event-info-banner text-3xl m-4 mb-8 mx-auto bg-rose-300 text-white p-8">
                    <div class="event-info-details">
                        <span class="inline-icon-text">
                            <span class="icon"><i data-lucide="calendar" style="transform: scale(1.5);"></i></span>
                            ${tournament.Date ? tournament.Date.substring(0, 10) : tournament.date || ''}
                        </span>
                        <span class="mx-2">&nbsp;</span>
                        <span class="inline-icon-text">
                            <span class="icon"><i data-lucide="map-pin" style="transform: scale(1.5);"></i></span>
                            ${tournament.Location || tournament.location || ''}
                        </span>
                    </div>
                    <div class="event-refresh-banner">
                        <span class="event-refresh-text">Last updated <span data-role="last-updated">never</span></span>
                        <button type="button" class="event-refresh-button" data-role="refresh-button" aria-label="Refresh competition view">Refresh</button>
                    </div>
                </div>
             </div>`;

    // Add the toggleIcon function to handle the icon toggle
    html += `<script>
             </script>`;

    html += '<nav class="event-manager-nav competition-nav mb-4 mt-4">';
    html += '  <div class="competition-info-group">';
    html += '    <div class="mr-4 mt-4 font-semibold" data-role="competition-label">Competitions:</div>';
    html += '    <div class="competition-links-container" data-role="links-container">';

    // Generate links for Competitions
    if (competitions.length > 0) {
        competitions.forEach(compName => {
            const encodedCompName = encodeURIComponent(compName);
            const updateUrl = `/event/${uuid}/competition-update${editable ? '/edit' : ''}?competition=${encodedCompName}`;
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

    html += '    </div>'; // Close competition-links-container
    html += '    <div class="competition-selection-display hidden" data-role="selection-display">';
    html += '        <span class="competition-selection-label">Competition:</span>';
    html += '        <span class="competition-selection-value" data-role="selection-value"></span>';
    html += '    </div>';
    html += '  </div>'; // Close competition-info-group
    html += '  <button type="button" class="competition-preferences-trigger" aria-label="Change default competition">...</button>';
    html += '</nav>';

    const modalOptions = competitions.map(compName => `
            <button type="button" class="competition-preferences-option" data-preference="${escapeAttribute(compName)}">${compName}</button>
        `).join('');

    html += `
        <div id="competition-preferences-modal" class="competition-preferences-modal hidden" role="dialog" aria-modal="true" aria-labelledby="competition-preferences-title">
            <div class="competition-preferences-content">
                <h3 id="competition-preferences-title" class="competition-preferences-heading">Select default competition</h3>
                <p class="competition-preferences-description">Choose which competition loads automatically when you open the event.</p>
                <div class="competition-preferences-options">
                    <button type="button" class="competition-preferences-option" data-preference="__ALL__">All competitions</button>
                    ${modalOptions}
                </div>
                <div class="competition-preferences-actions">
                    <button type="button" class="competition-preferences-close">Close</button>
                </div>
            </div>
        </div>
    `;

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
