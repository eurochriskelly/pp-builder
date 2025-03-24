const { allowedViews } = require('../../config/allowedViews');

function generateEventManager(tournamentId, uuid, tournament, isLoggedIn = false) {
    let html = '<div id="event-manager" style="margin: 20px 0;">';
    html += `<div style="text-align: center; margin-bottom: 20px;">
                <h2>${tournament.Title || tournament.title || 'Event'}</h2>
                <p>${tournament.Date ? tournament.Date.substring(0,10) : tournament.date || ''} | ${tournament.Location || tournament.location || ''}</p>
             </div>`;
    html += '<nav style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; max-width: 800px; margin: 0 auto;">';
    html += '<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; width: 100%;">';
    
    // Generate links from allowedViews
    Object.entries(allowedViews).forEach(([key, view]) => {
        html += `
            <a href="/event/${uuid}/${key}" 
               hx-get="/event/${uuid}/${key}" 
               hx-target="body" 
               hx-swap="outerHTML" 
               style="padding: 12px 20px; background-color: #3498db; color: white; font-size: 2rem;whites-pace:nowrap;text-decoration: none; border-radius: 5px; display: inline-block; margin-bottom: 10px; line-height: 40px; text-transform: uppercase; min-width: 180px; text-align: center; flex: 1 0 calc(50% - 20px); max-width: calc(50% - 20px);">
                ${view.title}
            </a>`;
    });
    
    html += '</div></nav>';
    html += '</div>';

    if (isLoggedIn) {
        html += `<script src="/scripts/tournamentSelectionScripts.js"></script>`;
    }
    
    html += `
    <script>
        // Replace competition headers
        document.querySelectorAll('th').forEach(th => {
            if (th.textContent.toLowerCase().includes('competition')) {
                th.textContent = 'Comp';
            }
        });
    </script>
    `;

    return html;
}

module.exports = { generateEventManager };
