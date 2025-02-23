module.exports = function generateTournamentSelection(tournaments) {
    let html = '<div id="tournament-selection">';
    html += '<h2>Select a Tournament</h2>';
    html += '<table>';
    html += '<tr><th>ID</th><th>Title</th><th>Date</th><th>Location</th><th>Action</th></tr>';
    tournaments.forEach(t => {
        html += '<tr>';
        html += `<td>${t.id}</td>`;
        html += `<td>${t.Title || t.title || 'N/A'}</td>`;
        html += `<td>${t.Date || t.date || 'N/A'}</td>`;
        html += `<td>${t.Location || t.location || 'N/A'}</td>`;
        html += `<td><button hx-get="/tournament/${t.id}" hx-target="body" hx-swap="outerHTML">View</button></td>`;
        html += '</tr>';
    });
    html += '</table>';
    html += '</div>';
    return html;
};
