const showCsvData = require('./partials/show-csv-data.js');
const uploadForm = require('./partials/upload-form.js');

module.exports = function generateImportFixtures(
  tournamentId,
  csvData = null, 
  validationResult = null
) {
    console.log('ti d', tournamentId)
  const heading = `Import Fixtures for Tournament ${tournamentId}`;
  const subHeading ='Upload a CSV file to import fixtures for this tournament.';

  let html = `
    <div id="import-fixtures" class="p-4 max-w-5xl mx-auto">
      <h2 class="text-2xl font-bold mb-2">${heading}</h2>
      <p class="text-gray-700 m-4">${subHeading}</p>
      ${uploadForm(tournamentId)}      
      <script src="/scripts/importFixturesScripts.js"></script>
   `;

  if (csvData) {
      html += showCsvData(csvData, validationResult, tournamentId)
  }

  html += '</div>';
  return html;
};


