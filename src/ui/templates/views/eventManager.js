const { allowedViews } = require('../../config/allowedViews');

function generateEventManager(tournamentId, uuid, isLoggedIn = false) {
    let html = '<div id="event-manager" style="margin: 20px 0;">';
    html += '<nav style="display: flex; gap: 10px; flex-wrap: wrap;">';
    
    // Generate links from allowedViews
    Object.entries(allowedViews).forEach(([key, view]) => {
        html += `
            <a href="/event/${uuid}/${key}" 
               hx-get="/event/${uuid}/${key}" 
               hx-target="body" 
               hx-swap="outerHTML" 
               style="padding: 8px 16px; background-color: #3498db; color: white; text-decoration: none; border-radius: 5px;">
                ${view.title}
            </a>`;
    });
    
    html += '</nav>';
    html += '</div>';

    if (isLoggedIn) {
        html += `<script src="/scripts/tournamentSelectionScripts.js"></script>`;
    }

    return html;
}

module.exports = { generateEventManager };
