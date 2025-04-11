const showValidationResult = require('./show-validation-result.js');

module.exports = function(csvData, validationResult, tournamentId) {

    let html = ''
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
      html += showValidationResult(validationResult, csvData, tournamentId);
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
    return html
}
