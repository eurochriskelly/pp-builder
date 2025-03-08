const { allowedViews } = require('../../config/allowedViews');

function generateEventManager(tournamentId, uuid, isLoggedIn = false) {
    let html = '<div id="event-manager" style="margin: 20px 0;">';
    html += '<nav style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center;">';
    
    // Generate links from allowedViews
    Object.entries(allowedViews).forEach(([key, view]) => {
        html += `
            <a href="/event/${uuid}/${key}" 
               hx-get="/event/${uuid}/${key}" 
               hx-target="body" 
               hx-swap="outerHTML" 
               style="padding: 12px 20px; background-color: #3498db; color: white; text-decoration: none; border-radius: 5px; display: inline-block; margin-bottom: 10px; line-height: 40px; text-transform: uppercase;">
                ${view.title}
            </a>`;
    });
    
    html += '</nav>';
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
