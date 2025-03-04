module.exports = function generateImportFixtures(tournamentId, csvData = null, validationResult = null) {
  let html = `
    <div id="import-fixtures" class="p-4 max-w-5xl mx-auto">
      <h2 class="text-2xl font-bold mb-2">Import Fixtures for Tournament ${tournamentId}</h2>
      <p class="text-gray-700 mb-4">Upload a CSV file to import fixtures for this tournament.</p>
      <form hx-post="/planning/${tournamentId}/import-fixtures" hx-target="#import-fixtures" hx-swap="outerHTML" enctype="multipart/form-data" class="mb-4">
        <div class="mb-4">
          <label for="file" class="block mb-1">CSV File:</label>
          <input type="file" id="file" name="file" accept=".csv" required class="w-full">
          <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded mt-2">Upload</button>
          <a href="/planning/${tournamentId}" hx-get="/planning/${tournamentId}" hx-target="body" hx-swap="outerHTML" class="ml-2 text-blue-600 underline">Cancel</a>
        </div>
      </form>
  `;

  if (csvData) {
    html += `
      <h3 class="text-xl font-semibold mb-2">Uploaded CSV Data</h3>
      <form hx-post="/planning/${tournamentId}/validate-fixtures" hx-target="#import-fixtures" hx-swap="outerHTML" class="mb-4">
        <input type="hidden" name="csvData" value="${encodeURIComponent(JSON.stringify(csvData))}">
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Validate</button>
      </form>
      <table class="w-full border-collapse mt-4">
        <tr class="bg-gray-200">
          <th class="p-2">Match ID</th><th class="p-2">Start Time</th><th class="p-2">Pitch</th><th class="p-2">Stage</th><th class="p-2">Category</th><th class="p-2">Group</th>
          <th class="p-2">Team 1</th><th class="p-2">Team 2</th><th class="p-2">Umpire Team</th><th class="p-2">Duration</th>
        </tr>
    `;
    csvData.forEach(row => {
      html += `
        <tr>
          <td class="p-2">${row.matchId || ''}</td>
          <td class="p-2">${row.startTime || ''}</td>
          <td class="p-2">${row.pitch || ''}</td>
          <td class="p-2">${row.stage || ''}</td>
          <td class="p-2">${row.category || ''}</td>
          <td class="p-2">${row.group || ''}</td>
          <td class="p-2">${row.team1 || ''}</td>
          <td class="p-2">${row.team2 || ''}</td>
          <td class="p-2">${row.umpireTeam || ''}</td>
          <td class="p-2">${row.duration || ''}</td>
        </tr>
      `;
    });
    html += '</table>';

    if (validationResult) {
      const { warnings, props, isValid } = validationResult;
      if (warnings && warnings.length > 0) {
        html += `
          <h3 class="text-xl font-semibold mt-4">Warnings</h3>
          <table class="w-full border-collapse mt-4 bg-red-100">
            <tr><th class="p-2">Warning</th></tr>
        `;
        warnings.forEach(warning => {
          html += `<tr><td class="p-2">${warning}</td></tr>`;
        });
        html += '</table>';
      } else {
        html += '<p class="text-green-600 mt-4">No warnings found. Data looks valid.</p>';
        if (isValid) {
          html += `
            <form hx-post="/planning/${tournamentId}/confirm-import" hx-target="body" hx-swap="outerHTML" class="mt-4">
              <input type="hidden" name="csvData" value="${encodeURIComponent(JSON.stringify(csvData))}">
              <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded">Confirm Import</button>
            </form>
          `;
        }
      }

      html += `
        <h3 class="text-xl font-semibold mt-4">Summary</h3>
        <p><strong>Categories:</strong> ${props.categories.join(', ')}</p>
        <p><strong>Pitches:</strong> ${props.pitches.join(', ')}</p>
        <p><strong>Groups:</strong> ${Object.keys(props.groups.byCategory).map(cat => `${cat}: ${props.groups.byCategory[cat].join(', ')}`).join('; ')}</p>
        <p><strong>Teams:</strong> ${Object.keys(props.teams.byCategory).map(cat => `${cat}: ${props.teams.byCategory[cat].join(', ')}`).join('; ')}</p>
      `;
    }
  }

  html += '</div>';
  return html;
};
