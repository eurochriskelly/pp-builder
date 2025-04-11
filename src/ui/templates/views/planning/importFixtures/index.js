const showCsvData = require('./partials/show-csv-data.js');

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
      
      <form 
        id="import-form"
        hx-post="/planning/${tournamentId}/import-fixtures" 
        hx-target="#import-fixtures" 
        hx-swap="outerHTML" 
        enctype="multipart/form-data" 
        class="mb-4"
      >
        <div class="mb-4">
          <label class="block mb-2 font-semibold">Import Method:</label>
          <div class="flex items-center mb-2">
            <input 
              type="radio" 
              id="upload-csv" 
              name="importMethod" 
              value="upload" 
              checked 
              onchange="toggleImportMethod('upload')"
              class="mr-2"
            >
            <label for="upload-csv">Upload CSV File</label>
          </div>
          <div class="flex items-center mb-4">
            <input 
              type="radio" 
              id="paste-data" 
              name="importMethod" 
              value="paste" 
              onchange="toggleImportMethod('paste')"
              class="mr-2"
            >
            <label for="paste-data">Paste Data</label>
          </div>
        </div>

        <div id="upload-section" class="mb-4">
          <label for="file" class="block mb-1">CSV File:</label>
          <input type="file" id="file" name="file" accept=".csv" required class="w-full border p-1">
        </div>

        <div id="paste-section" class="mb-4" style="display: none;">
          <div class="flex justify-between items-center mb-1">
             <label for="pastedData" class="block font-medium">Paste your spreadsheet fixtures here:</label>
             <div class="space-x-2">
                 <button 
                    type="button" 
                    onclick="clearPastedData()" 
                    class="text-sm bg-blue-400 hover:bg-gray-500 text-black px-2 py-1 rounded"
                 >Clear</button>
             </div>
          </div>
          <textarea id="pastedData" name="pastedData" rows="10" class="w-full border p-1"></textarea>
        </div>

        <div>
          <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded mt-2">Process Data</button>
          <a href="/planning/${tournamentId}" hx-get="/planning/${tournamentId}" hx-target="body" hx-swap="outerHTML" class="ml-2 text-blue-600 underline">Cancel</a>
        </div>

      </form>

      <script>
        function toggleImportMethod(method) {
          const uploadSection = document.getElementById('upload-section');
          const pasteSection = document.getElementById('paste-section');
          const fileInput = document.getElementById('file');
          const pasteInput = document.getElementById('pastedData');

          // Ensure elements exist before manipulating them
          if (!uploadSection || !pasteSection || !fileInput || !pasteInput) {
            console.error('Import form elements not found for toggling.');
            return;
          }

          if (method === 'upload') {
            uploadSection.style.display = 'block';
            pasteSection.style.display = 'none';
            fileInput.required = true;
            pasteInput.required = false;
          } else {
            uploadSection.style.display = 'none';
            pasteSection.style.display = 'block';
            fileInput.required = false;
            pasteInput.required = true;
          }
        }
        
        // Function to initialize or re-initialize the toggle state
        function initializeToggleState() {
            const uploadRadio = document.getElementById('upload-csv');
            const pasteRadio = document.getElementById('paste-data');
            
            if (uploadRadio?.checked) {
                 toggleImportMethod('upload');
            } else if (pasteRadio?.checked) {
                 toggleImportMethod('paste');
            } else if (uploadRadio) { 
                 // Default to upload if neither is checked (shouldn't happen with 'checked' attribute, but safe fallback)
                 uploadRadio.checked = true;
                 toggleImportMethod('upload');
            }
        }

        // Run initialization when the script loads initially
        // Use DOMContentLoaded for initial page load if this script runs early
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeToggleState);
        } else {
            // If DOM is already ready, run immediately
            initializeToggleState();
        }

        // Ensure HTMX swap also triggers the re-initialization
        document.body.addEventListener('htmx:afterSwap', function(event) {
console.log('triggered')
            // Check if the swapped content contains our import form elements
            if (event.detail.target.querySelector('#import-form')) {
                 initializeToggleState();
            } else if (event.detail.target.id === 'import-fixtures' || event.detail.target.closest('#import-fixtures')) {
                 // Also handle cases where the target itself or a parent is the container
                 initializeToggleState();
            }
        });


        function clearPastedData() {
            const pasteInput = document.getElementById('pastedData');
            if (pasteInput) {
                pasteInput.value = '';
            } else {
                 console.error('Paste textarea not found for clearing.');
            }
        }
      </script>
  `;

  if (csvData) {
      html += showCsvData(csvData, validationResult, tournamentId)
  }

  html += '</div>';
  return html;
};


