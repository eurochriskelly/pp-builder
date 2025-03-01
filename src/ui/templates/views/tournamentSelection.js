module.exports = function generateTournamentSelection(tournaments, isLoggedIn = false, baseUrl = 'http://localhost:5421') {
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
            const shareUrl = `${baseUrl}/event/${eventUuid}`;
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
                        <button onclick="copyToClipboard('${shareUrl}')" style="background-color: #2ecc71; color: white; padding: 5px 10px; border: none; border-radius: 5px; cursor: pointer;">
                            Copy Link
                        </button>
                    </td>`;
            }
            html += '</tr>';
        });
    html += '</table>';
    html += '</div>';

    html += `
        <script>
            function copyToClipboard(text) {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(text)
                        .then(() => {
                            alert('Link copied to clipboard: ' + text);
                        })
                        .catch(err => {
                            console.error('Failed to copy with clipboard API: ', err);
                            fallbackCopyToClipboard(text);
                        });
                } else {
                    console.warn('Clipboard API not available, using fallback');
                    fallbackCopyToClipboard(text);
                }
            }

            function fallbackCopyToClipboard(text) {
                var textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.select();
                try {
                    var successful = document.execCommand('copy');
                    if (successful) {
                        alert('Link copied to clipboard: ' + text);
                    } else {
                        alert('Failed to copy link. Please copy manually: ' + text);
                    }
                } catch (err) {
                    console.error('Fallback copy failed: ', err);
                    alert('Failed to copy link. Please copy manually: ' + text);
                }
                document.body.removeChild(textarea);
            }
        </script>
    `;

    return html;
};
