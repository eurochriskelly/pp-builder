const showCsvData = require('./partials/show-csv-data.js');

module.exports = function generateImportFixtures(
  tournamentId,
  csvData = null, 
  validationResult = null
) {
  const heading = `Import Fixtures for Tournament ${tournamentId}`;
  const subHeading ='Upload a CSV file to import fixtures for this tournament.';
  let html = `
    <div id="import-fixtures" class="p-4 max-w-5xl mx-auto">
      <h2 class="text-2xl font-bold mb-2">${heading}</h2>
      <p class="text-gray-700 m-4">${subHeading}</p>
      <p>&nbsp;</p> 
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
      showCsvData(csvData)
  }

  html += '</div>';
  return html;
};


