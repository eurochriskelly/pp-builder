module.exports = function generateImportFixtures(
  tournamentId,
  csvData = null, 
  validationResult = null
) {
    console.log(csvData)
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
    // Only show validate button if we don't already have valid data
    if (!validationResult || validationResult.warnings?.length > 0) {
      html += `
        <form hx-post="/planning/${tournamentId}/validate-fixtures" hx-target="#import-fixtures" hx-swap="outerHTML" class="mb-4">
          <input type="hidden" name="csvData" value="${encodeURIComponent(JSON.stringify(csvData))}">
          <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Validate</button>
        </form>
      `;
    }

    // Validation results will be displayed first if available
    if (validationResult) {
      const { warnings, props, isValid } = validationResult;

      // Show Confirm Import button first if data is valid
      if (isValid && (!warnings || warnings.length === 0)) {
        html += `
          <form hx-post="/planning/${tournamentId}/confirm-import" hx-target="body" hx-swap="outerHTML" class="mt-4">
            <input type="hidden" name="csvData" value="${encodeURIComponent(JSON.stringify(csvData))}">
            <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded">Confirm Import</button>
          </form>
          <p class="text-green-600 mt-4">No warnings found. Data looks valid.</p>
        `;
      }

      html += `
        <div class="mt-4">
          <h3 class="text-xl font-semibold mb-2">Summary</h3>
          <table class="w-full border-collapse mb-4">
            <tbody>
              <tr class="bg-gray-50"><td class="p-2 border font-semibold w-1/4">Categories</td><td class="p-2 border">${props.categories.join(', ')}</td></tr>
              <tr><td class="p-2 border font-semibold w-1/4">Pitches</td><td class="p-2 border">${props.pitches.join(', ')}</td></tr>
              <tr class="bg-gray-50"><td class="p-2 border font-semibold w-1/4">Groups</td><td class="p-2 border">${Object.keys(props.groups.byCategory).map(cat => `<strong>${cat}:</strong> ${props.groups.byCategory[cat].join(', ')}`).join('<br>')}</td></tr>
              <tr><td class="p-2 border font-semibold w-1/4">Teams</td><td class="p-2 border">${Object.keys(props.teams.byCategory).map(cat => `<strong>${cat}:</strong> ${props.teams.byCategory[cat].join(', ')}`).join('<br>')}</td></tr>
            </tbody>
          </table>
        </div>
      `;

      if (warnings && warnings.length > 0) {
        html += `
          <div class="mt-4">
            <h3 class="text-xl font-semibold mb-2">Validation Warnings (${warnings.length})</h3>
            <table class="w-full border-collapse">
              <tbody>
        `;
        warnings.forEach((warning, index) => {
          const rowClass = index % 2 === 0 ? 'bg-red-50' : 'bg-red-100';
          html += `<tr class="${rowClass}"><td class="p-2 border border-red-200 text-red-700">${warning}</td></tr>`;
        });
        html += `
              </tbody>
            </table>
          </div>
        `;
      }
    }

    // Now add the table structure and headers directly to html
    html += `
      <div class="mt-8">
        <h3 class="text-xl font-semibold mb-2">Uploaded CSV Data</h3>
        <table class="w-full border-collapse">
          <thead class="bg-gray-200">
            <tr>
              <th class="p-2 text-left">Match ID</th><th class="p-2 text-left">Start Time</th><th class="p-2 text-left">Pitch</th><th class="p-2 text-left">Stage</th><th class="p-2 text-left">Category</th><th class="p-2 text-left">Group</th>
              <th class="p-2 text-left">Team 1</th><th class="p-2 text-left">Team 2</th><th class="p-2 text-left">Umpire Team</th><th class="p-2 text-left">Duration</th>
            </tr>
          </thead>
          <tbody>
    `;
    // Append rows
    csvData.forEach(row => {
      html += `
        <tr>
          <td class="p-2 border">${row.matchId || ''}</td>
          <td class="p-2">${row.startTime || ''}</td>
          <td class="p-2">${row.pitch || ''}</td>
          <td class="p-2">${row.stage || ''}</td>
          <td class="p-2">${row.category || ''}</td>
          <td class="p-2">${row.group || ''}</td>
          <td class="p-2">${row.team1 || ''}</td>
          <td class="p-2">${row.team2 || ''}</td>
          <td class="p-2 border">${row.umpireTeam || ''}</td>
          <td class="p-2 border">${row.duration || ''}</td>
        </tr>
      `;
    });
    // Close table body and div
    html += `
          </tbody>
        </table>
      </div>
    `;
  } // End of if (csvData)

  html += '</div>';
  return html;
};
