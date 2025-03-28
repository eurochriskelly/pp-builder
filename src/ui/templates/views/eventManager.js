const { allowedViews } = require('../../config/allowedViews');

function generateEventManager(tournamentId, uuid, tournament, isLoggedIn = false) {
    // Use CSS classes instead of inline styles
    let html = '<div id="event-manager" class="event-manager-container">'; 
    // Restore mx-auto for centering (assuming Tailwind is active)
    html += `<div class="event-manager-header">
                <h2 class="mx-auto">${tournament.Title || tournament.title || 'Event'}</h2>
                <p class="text-3xl m-4 mb-8 mx-auto">${tournament.Date ? tournament.Date.substring(0,10) : tournament.date || ''} | ${tournament.Location || tournament.location || ''}</p>
             </div>`;
    html += '<nav class="event-manager-nav">';
    html += '<div class="event-manager-nav-inner">';
    
    // Generate links from allowedViews
    Object.entries(allowedViews).forEach(([key, view]) => {
        html += `
            <a href="/event/${uuid}/${key}" 
               hx-get="/event/${uuid}/${key}" 
               hx-target="body" 
               hx-swap="outerHTML" 
               class="event-manager-link"> 
                ${view.title}
            </a>`; // Apply class 'event-manager-link'
    });
    
    html += '</div></nav>';
    html += '</div>';

    if (isLoggedIn) {
        html += `<script src="/scripts/tournamentSelectionScripts.js"></script>`;
    }
    
    html += `
    <script>
        // Shorten 'Competition' headers using the assigned class
        document.querySelectorAll('th.comp-column').forEach(th => {
             // Check if it hasn't already been shortened by the template
            if (th.textContent.toLowerCase().includes('competition')) { 
                 th.textContent = 'Comp';
            }
        });
    </script>
    `;

    return html;
}

module.exports = { generateEventManager };
