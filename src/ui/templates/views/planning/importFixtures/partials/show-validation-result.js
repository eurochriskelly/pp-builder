module.exports = function(validationResult, csvData='', tournamentId) {
      let html = '';

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
      return html;
}
