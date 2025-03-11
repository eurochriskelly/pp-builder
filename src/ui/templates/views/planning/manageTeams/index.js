module.exports = function generateManageTeams(tournamentId, tournament = null) {
  let html = `
    <div id="manage-teams" class="p-4 max-w-5xl mx-auto">
      <h2 class="text-2xl font-bold mb-2">Manage Teams for Tournament ${tournamentId}</h2>
      <p class="text-gray-700 mb-4">
        Competition: 
        <select class="border p-1">
          <option>Mens Senior</option>
          <option>Mens Junior</option>
          <option>Mens Intermediate</option>
        </select>
      </p>
      <h3 class="text-xl font-semibold mb-2">Create new team:</h3>
      <div class="mb-4 flex items-center gap-4">
        <div>
          <label class="block mb-1">CLUB</label>
          <select class="border p-1">
            <option>Paris FC</option>
            <option>Berlin GAA</option>
            <option>Dublin Rovers</option>
          </select>
        </div>
        <div>
          <label class="block mb-1">#PLAYERS</label>
          <input type="number" value="3" class="border p-1 w-20">
        </div>
        <div class="mt-6">
          <button class="bg-blue-500 text-white px-4 py-2 rounded">&lt;ADD&gt;</button>
        </div>
      </div>
      <div class="mb-4">
        <p><strong>Club(s):</strong> Paris FC (8) / Berlin GAA (3) / Dublin Rovers (1)</p>
        <p><strong>Generated Name:</strong> Par/Ber/Dub</p>
        <p class="mt-2">
          <label for="teamAlias" class="block">Team Alias</label>
          <input type="text" id="teamAlias" name="teamAlias" placeholder="Mauraders" class="border p-1 w-full">
        </p>
      </div>
      <div>
        <button class="bg-green-600 text-white px-4 py-2 rounded"><submit></button>
      </div>
    </div>
  `;
  return html;
};
