const sample = [
  {
    foo: "121",
    bar: "hello"
  },
  {
    foo: "123",
    bar: "hello 3"
  }
]


module.exports = function (
  tournamentId,
) {
    
  return `
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
             ${renderSampleTable(sample)}
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
  `
}

function renderSampleTable(sample) {
  if (!sample || !sample.length) return '';
  
  const headers = Object.keys(sample[0]);
  return `
    <div class="text-xs mb-2">
      <span class="font-semibold">Example format:</span>
      <table class="border border-gray-300 mt-1">
        <thead>
          <tr>
            ${headers.map(h => `<th class="border px-2 py-1 bg-gray-100">${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${sample.map(row => `
            <tr>
              ${headers.map(h => `<td class="border px-2 py-1">${row[h]}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}
