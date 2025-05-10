module.exports = (
    tournamentId,
    categories,
    selectedCategory = 'Men',
) => {
    let html = '<div id="planning-matches">';

    html += '<h2>Simulate running tournament</h2>';
    html += `
    <p class= "h-14 mb-2 ">
        <div>Simulate tournament scenarios by playing upcoming matches or import fixtures from a CSV.</div>
        <div class="mb-4">
            <button class="bg-orange-500 text-white rounded p-4 ml-2"
                    hx-get="/planning/${tournamentId}/import-fixtures" 
                    hx-target="body" 
                    hx-swap="outerHTML">Import Fixtures</button>
            <button class="bg-red-500 text-white rounded p-4" hx-get="/planning/' + tournamentId + '/reset" hx-target="#planning-matches" hx-swap="outerHTML" hx-trigger="click" hx-on::after-request="htmx.ajax(\'GET\', \'/planning/' + tournamentId + '\', \'#planning-matches\')">Reset Tournament</button>
        </div>
    </p>`;

    html += `<div class="mb-4 mt-4">
    <label for="category-filter" class="mr-2 font-semibold">Filter by Category:</label>
    <select id="category-filter" class="p-2 border border-gray-500 rounded bg-white text-2xl"  
            onchange="if(this.value) { window.location.href = '/planning/${tournamentId}/matches/category/' + encodeURIComponent(this.value); } else { window.location.href = '/planning/${tournamentId}/matches'; }">
      <option value="">-- Select a Category --</option>`;
    html += categories.map(cat => `<option value="${cat}" ${selectedCategory === cat ? 'selected' : ''}>${cat}</option>`).join('');
    html += '</select>';
    html += '</div>';

    // Show play controls by default if a category is selected
    html += `<div id="play-controls" class="mb-5 overflow-hidden" style="${selectedCategory ? '' : 'display:none'}">`;
    if (categories.length > 0) {
        const simulateUrl = selectedCategory
            ? `/planning/${tournamentId}/simulate/1/${encodeURIComponent(selectedCategory)}`
            : `/planning/${tournamentId}/simulate/1/`;
        html += `<button id="play-next-match-btn" class="bg-blue-500 text-white rounded px-3 py-2 ml-2" hx-post="${simulateUrl}" hx-target="#planning-matches" hx-swap="outerHTML">Play Next Match</button> `;
        html += `<input type="hidden" name="category-param" id="category-param" value="${selectedCategory || ''}">`;
        html += `<input type="number" id="play-n-matches-input" min="1" class="w-20 ml-2 p-2 bg-white border border-gray-300 rounded" placeholder="N"> `;
        html += `<button class="bg-green-500 text-white rounded px-3 py-2 ml-2" onclick="playNextNMatches(document.getElementById('play-n-matches-input').value, '${tournamentId}', '${selectedCategory || ''}')">Play Next N Matches</button>`;
    }
    html += '</div>';
    return html;
}