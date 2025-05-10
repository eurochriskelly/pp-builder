const simulateHeader = require('./partials/simulate-header');
const { generateFinishedRow, generateUpcomingRow } = require('./partials/generate-rows');
// Note: This view relies on the <knockout-level> web component being loaded.
// Ensure it's included globally or via the build process.


// ----- Main Exported Function -----
module.exports = function generateMatchesPlanning(data) {
    const categories = [...new Set(data.matches.map(match => match.category || 'Uncategorized'))].sort();

    // Pass the selectedCategory to the simulateHeader function
    let html = simulateHeader(data.tournamentId, categories, data.selectedCategory);

    // Add message div, initially hidden or shown based on selectedCategory
    html += `<div id="no-category-message" 
                  style="text-align: center; margin-top: 20px; ${data.selectedCategory ? 'display: none;' : ''}">
                  Please select a category to continue.
            </div>`;

    // Wrap tables in a container, initially hidden or shown based on selectedCategory
    html += `<div id="matches-tables-container" style="${!data.selectedCategory ? 'display: none;' : ''}">`;

    const upcomingMatches = data.matches
        .filter(match => match.started === 'false')
        .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime) || a.id - b.id);
    const finishedMatches = data.matches
        .filter(match => match.started === 'true')
        .sort((a, b) => b.scheduledTime.localeCompare(a.scheduledTime) || b.id - a.id);

    html += `<h3 id="upcoming-header" style="font-size: 1.25em; margin-top: 30px;">UPCOMING GAMES (0)</h3>`;

    html += '<table id="upcoming-table" style="width: 100%; border-collapse: collapse;">';
    const upcomingHeaders = ['ID', 'Category', 'Stage', 'Pitch', 'Time', 'Team 1', 'Team 2', 'Umpire'];
    html += `<thead><tr>${upcomingHeaders.map(h => `<th style="background-color: transparent; padding: 8px; text-align: left; border-bottom: 1px solid #ccc;">${h.toUpperCase()}</th>`).join('')}</tr></thead>`;
    html += '<tbody>';
    const firstUpcomingId = upcomingMatches[0] ? upcomingMatches[0].id : null;
    upcomingMatches.forEach((row, index) => {
        html += generateUpcomingRow(row, index, data.tournamentId, true, firstUpcomingId);
    });

    html += '</tbody></table>';

    html += `<div id="show-more-container-upcoming" style="margin-top: 10px; text-align: center; display: none;">`;
    html += `<a id="show-more-upcoming" href="#" style="color: #3498db; text-decoration: underline;">Show More</a>`;
    html += `<a id="show-less-upcoming" href="#" style="color: #3498db; text-decoration: underline; display: none;">Show Less</a>`;
    html += `</div>`;

    html += `<h3 id="finished-header" style="font-size: 1.25em; margin-top: 30px;">FINISHED GAMES (0)</h3>`;
    html += '<table id="finished-table" style="margin-top: 10px; width: 100%; border-collapse: collapse;">';
    const finishedHeaders = ['ID', 'Category', 'Stage',  'Team 1', 'Score', 'Score', 'Team 2'];
    html += `<thead><tr>${finishedHeaders.map(h => `<th style="background-color: transparent; padding: 8px; text-align: left; border-bottom: 1px solid #ccc;">${h.toUpperCase()}</th>`).join('')}</tr></thead>`;
    html += '<tbody>';
    finishedMatches.forEach((row, index) => {
        html += generateFinishedRow(row, index, true);
    });
    html += '</tbody></table>';
    html += `<div id="show-more-container-finished" style="margin-top: 10px; text-align: center; display: none;">`;
    html += `<a id="show-more-finished" href="#" style="color: #3498db; text-decoration: underline;">Show More</a>`;
    html += `<a id="show-less-finished" href="#" style="color: #3498db; text-decoration: underline; display: none;">Show Less</a>`;
    html += `</div>`;
    html += '</div>'; // Close matches-tables-container

    html += `
        <link rel="stylesheet" href="/styles/matches.style.css">
        <script src="/scripts/matches.public.js"></script>
        <script>
            function updatePlayNextEndpoint(category) {
                const playNextButton = document.getElementById('play-next-match-btn');
                const basePath = '/planning/${data.tournamentId}/simulate/1';
                const newPath = category ? \`\${basePath}/\${encodeURIComponent(category)}\` : basePath;
                playNextButton.setAttribute('hx-post', newPath);
            }
        </script>
    `;

    return html;
};
