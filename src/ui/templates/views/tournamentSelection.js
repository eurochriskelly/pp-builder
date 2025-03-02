module.exports = function generateTournamentSelection(tournaments, isLoggedIn = false) {
    let html = '<div id="tournament-selection">';
    html += '<h2>Select a Tournament</h2>';
    if (isLoggedIn) {
        html += `
            <div style="margin-bottom: 20px;">
                <button hx-get="/create-tournament" hx-target="body" hx-swap="outerHTML" style="background-color: #3498db; color: white;">Create Tournament</button>
            </div>
        `;
    }
    html += '<table>';
    html += '<tr><th>ID</th><th>Title</th><th>Date</th><th>Location</th>' + 
            (isLoggedIn ? '<th>Planning</th><th>Execution</th><th>Share</th>' : '') + '</tr>';
    tournaments
        .sort((a, b) => (a.Date > b.Date) ? -1 : ((a.Date < b.Date) ? 1 : 0))
        .forEach(t => {
            const eventUuid = t.eventUuid || 'N/A';
            html += '<tr>';
            html += `<td>${t.Id}</td>`;
            html += `<td>${t.Title || t.title || 'N/A'}</td>`;
            html += `<td>${t.Date.substring(0, 10) || t.date || 'N/A'}</td>`;
            html += `<td>${t.Location || t.location || 'N/A'}</td>`;
            if (isLoggedIn) {
                html += `<td><button hx-get="/planning/${t.Id}" hx-target="body" hx-swap="outerHTML">Planning</button></td>`;
                html += `<td><button hx-get="/execution/${t.Id}/recent" hx-target="body" hx-swap="outerHTML">Execution</button></td>`;
                html += `
                    <td>
                        <button id="copy-link-btn-${eventUuid}" onclick="copyEventLink('${eventUuid}')" style="background-color: #2ecc71; color: white; padding: 5px 10px; border: none; border-radius: 5px; cursor: pointer;">
                            Copy Link
                        </button>
                    </td>`;
            }
            html += '</tr>';
        });
    html += '</table>';
    html += '</div>';
    
    // Include the external script
    html += `<script src="/scripts/tournamentSelectionScripts.js"></script>`;

    return html;
};
