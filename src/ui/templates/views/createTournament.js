module.exports = function generateCreateTournament() {
  return `
    <div id="create-tournament-form" class="p-5 max-w-xl mx-auto">
      <h2 class="text-2xl font-bold mb-4">Create a New Tournament</h2>
      <form hx-post="/create-tournament" hx-target="body" hx-swap="outerHTML" hx-headers='{"Content-Type": "application/x-www-form-urlencoded"}' class="flex flex-col gap-4">
        <div>
          <label for="title" class="block mb-1">Title:</label>
          <input type="text" id="title" name="title" required class="w-full p-2 border rounded">
        </div>
        <div>
          <label for="date" class="block mb-1">Date:</label>
          <input type="date" id="date" name="date" required class="w-full p-2 border rounded">
        </div>
        <div>
          <label for="location" class="block mb-1">Location:</label>
          <input type="text" id="location" name="location" required class="w-full p-2 border rounded">
        </div>
        <div>
          <label for="lat" class="block mb-1">Latitude (optional):</label>
          <input type="number" id="lat" name="lat" step="any" class="w-full p-2 border rounded">
        </div>
        <div>
          <label for="lon" class="block mb-1">Longitude (optional):</label>
          <input type="number" id="lon" name="lon" step="any" class="w-full p-2 border rounded">
        </div>
        <div class="flex gap-2">
          <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Create</button>
          <button 
            type="button" 
            class="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            onclick="document.getElementById('create-tournament-modal').style.display='none'; document.getElementById('create-tournament-modal-content').innerHTML='';"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  `;
};
