module.exports = function generateTournamentSelection(tournaments, isLoggedIn = false) {
    let html = '<div id="tournament-selection">';
    html += '<h2>Select a Tournament</h2>';
    html += '<table>';
    html += '<tr><th>ID</th><th>Title</th><th>Date</th><th>Location</th>' + 
            (isLoggedIn ? '<th>Planning</th><th>Execution</th>' : '') + '</tr>';
    tournaments.forEach(t => {
        html += '<tr>';
        html += `<td>${t.Id}</td>`;
        html += `<td>${t.Title || t.title || 'N/A'}</td>`;
        html += `<td>${t.Date || t.date || 'N/A'}</td>`;
        html += `<td>${t.Location || t.location || 'N/A'}</td>`;
        if (isLoggedIn) {
            html += `<td><button hx-get="/planning/${t.Id}" hx-target="body" hx-swap="outerHTML">Planning</button></td>`;
            html += `<td><button hx-get="/execution/${t.Id}/recent" hx-target="body" hx-swap="outerHTML">Execution</button></td>`;
        }
        html += '</tr>';
    });
    html += '</table>';
    html += '</div>';
    return html;
};
