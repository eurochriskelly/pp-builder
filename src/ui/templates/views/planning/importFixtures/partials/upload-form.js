// Sample data reflecting the expected TSV structure for pasting
const sample = [
  { MATCH: "U12.1", STAGE: "Grp.1", TEAM1: "St Marys", TEAM2: "Westport", UMPIRES: "John Doe", DURATION: "15", TIME: "09:00", PITCH: "Pitch 1", COMPETITION: "U12 Cup" },
  { MATCH: "U14.1", STAGE: "Grp.A", TEAM1: "Castlebar", TEAM2: "Ballina", UMPIRES: "Jane Smith", DURATION: "20", TIME: "09:00", PITCH: "Pitch 2", COMPETITION: "U14 Shield" },
  { MATCH: "U12.101", STAGE: "Cup.SF1", TEAM1: "Winner U12.1", TEAM2: "Winner U12.2", UMPIRES: "Winner U12.3", DURATION: "15", TIME: "11:00", PITCH: "Pitch 1", COMPETITION: "U12 Cup" },
  { MATCH: "U12.201", STAGE: "Cup.Fin", TEAM1: "Winner U12.101", TEAM2: "Winner U12.102", UMPIRES: "Winner U12.103", DURATION: "20", TIME: "14:00", PITCH: "Main Field", COMPETITION: "U12 Cup" },
  { MATCH: "U12.202", STAGE: "Cup.3/4", TEAM1: "Loser U12.101", TEAM2: "Loser U12.102", UMPIRES: "Loser U12.103", DURATION: "15", TIME: "13:00", PITCH: "Pitch 2", COMPETITION: "U12 Cup" }
];


module.exports = function (
  tournamentId,
) {
  const input1 = `
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
 ` 
  const form = ``
  return `
      <form 
        id="import-form"
        hx-post="/planning/${tournamentId}/import-fixtures" 
        hx-target="#import-fixtures" 
        hx-swap="outerHTML" 
        enctype="multipart/form-data" 
        class="mb-4"
      >
      ${input1}
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
          <div>${renderSampleTable(sample)}</div>
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
      <h2>Here is some sample data</h2>
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
