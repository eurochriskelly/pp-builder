const { allowedViews } = require('../../config/allowedViews');

function generateEventManager(tournamentId, uuid, isLoggedIn = false) {
    let html = '<div id="event-manager" style="margin: 20px 0;">';
    html += '<nav style="display: flex; gap: 10px; flex-wrap: wrap;">';
    Object.keys(allowedViews).forEach((view) => {
        const { title } = allowedViews[view] || 'unknown';
        html += `<a href="/event/${uuid}/${view}" hx-get="/event/${uuid}/${view}" hx-target="body" hx-swap="outerHTML" style="padding: 8px 16px; background-color: #3498db; color: white; text-decoration: none; border-radius: 5px;">${title}</a>`;
    });
    if (isLoggedIn) {
        html += `
            <button id="copy-link-btn-${uuid}" onclick="copyEventLink('${uuid}')" style="padding: 8px 16px; background-color: #2ecc71; color: white; border: none; border-radius: 5px; cursor: pointer;">
                Copy Link
            </button>
        `;
    }
    html += '</nav>';
    html += '</div>';

    if (isLoggedIn) {
        html += `<script src="/scripts/tournamentSelectionScripts.js"></script>`;
    }

    return html;
}

module.exports = { generateEventManager };
