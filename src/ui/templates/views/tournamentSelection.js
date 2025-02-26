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
            (isLoggedIn ? '<th>Planning</th><th>Execution</th>' : '') + '</tr>';
    tournaments
      .forEach(t => {
          html += '<tr>';
          html += `<td>${t.Id}</td>`;
          html += `<td>${t.Title || t.title || 'N/A'}</td>`;
          html += `<td>${t.Date.substring(0, 10) || t.date || 'N/A'}</td>`;
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


module.exports = function generateTournamentSelection(tournaments, isLoggedIn = false) {
    let html = '<div id="tournament-selection">';
    html += '<h2>Select a Tournament</h2>';
    if (isLoggedIn) {
        html += `
            <div style="margin-bottom: 20px;">
                <button hx-get="/create-tournament" hx-target="body" hx-swap="outerHTML" style="background-color: #3498db; color: white;">Create Tournament</button>
                <button hx-get="/import-fixtures" hx-target="body" hx-swap="outerHTML" style="background-color: #e67e22; color: white; margin-left: 10px;">Import Fixtures</button>
            </div>
        `;
    }
    html += '<table>';
    html += '<tr><th>ID</th><th>Title</th><th>Date</th><th>Location</th>' + 
            (isLoggedIn ? '<th>Planning</th><th>Execution</th>' : '') + '</tr>';
    tournaments
      .sort((a, b) => (a.Date > b.Date) ? -1 : ((a.Date < b.Date) ? 1 : 0))
      .forEach(t => {
          html += '<tr>';
          html += `<td>${t.Id}</td>`;
          html += `<td>${t.Title || t.title || 'N/A'}</td>`;
          html += `<td>${t.Date.substring(0, 10) || t.date || 'N/A'}</td>`;
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

