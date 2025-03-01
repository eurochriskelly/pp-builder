module.exports = function generateEventManager(tournamentId, uuid) {
    const allowedViews = [
        { view: 'recent', label: 'Recent Matches' },
        { view: 'view2', label: 'Group Fixtures' },
        // Add more as needed, e.g., { view: 'view3', label: 'Group Standings' }
    ];

    let html = '<div id="event-manager" style="margin: 20px 0;">';
    html += '<h3>Event Navigation</h3>';
    html += '<nav style="display: flex; gap: 10px;">';
    allowedViews.forEach(({ view, label }) => {
        html += `<a href="/event/${uuid}/${view}" hx-get="/event/${uuid}/${view}" hx-target="body" hx-swap="outerHTML" style="padding: 8px 16px; background-color: #3498db; color: white; text-decoration: none; border-radius: 5px;">${label}</a>`;
    });
    html += '</nav>';
    html += '</div>';
    return html;
};
