module.exports = (
    tournamentId,
    categories,
) => {
    let html = '<div id="planning-matches">';

    html += '<h2>Simulate running tournament</h2>';
    html += `<p class= "h-24 mb-2">
        <span>Simulate tournament scenarios by playing upcoming matches or import fixtures from a CSV.</span>
        <button class="bg-orange-500 text-white rounded px-3 py-2 ml-2 float-right" 
                hx-get="/planning/${tournamentId}/import-fixtures" 
                hx-target="body" 
                hx-swap="outerHTML">Import Fixtures</button>
    </p>`;

    html += '<div class="mb-4">';
    html += '<label for="category-filter" class="mr-2 font-semibold">Filter by Category:</label>';
    html += '<select id="category-filter" class="p-2 border border-gray-500 rounded bg-white text-2xl" onchange="window.selectedCategory = this.value; filterByCategory(this.value)">';
    html += '<option value="">-- Select a Category --</option>';
    html += categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
    html += '</select>';
    html += '</div>';

    if (categories.length > 0) {
        html += '<div id="play-controls" class="mb-5 overflow-hidden" style="display:none">';
        html += '<button class="bg-red-500 text-white rounded px-3 py-2" hx-get="/planning/' + tournamentId + '/reset" hx-target="#planning-matches" hx-swap="outerHTML" hx-trigger="click" hx-on::after-request="htmx.ajax(\'GET\', \'/planning/' + tournamentId + '\', \'#planning-matches\')">Reset Tournament</button> ';
        html += '<button id="play-next-match-btn" class="bg-blue-500 text instantiation-white rounded px-3 py-2 ml-2" hx-post="/planning/' + tournamentId + '/simulate/1" hx-target="#planning-matches" hx-swap="outerHTML">Play Next Match</button> ';
        html += `<input type="number" id="play-n-matches-input" min="1" class="w-20 ml-2 p-2 bg-white border border-gray-300 rounded" placeholder="N"> `;
        html += `<button class="bg-green-500 text-white rounded px-3 py-2 ml-2" onclick="playNextNMatches(document.getElementById('play-n-matches-input').value, '${tournamentId}')">Play Next N Matches</button>`;
        html += '</div>';
    } 
    return html;
}