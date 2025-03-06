module.exports = function generateTournamentInfo(tournament = null) {
  const isEdit = !!tournament; // If tournament exists, we're editing
  const id = tournament ? tournament.Id : '';
  const title = tournament ? tournament.Title || tournament.title || '' : '';
  const date = tournament ? (tournament.Date || tournament.date || '').substring(0, 10) : '';
  const location = tournament ? tournament.Location || tournament.location || '' : '';
  const lat = tournament ? tournament.lat || '' : '';
  const lon = tournament ? tournament.lon || '' : '';

  return `
    <div id="tournament-info" class="p-5 max-w-xl mx-auto">
      <h2 class="text-2xl font-bold mb-4">${isEdit ? 'Edit Tournament' : 'Create a New Tournament'}</h2>
      <form hx-post="${isEdit ? `/planning/${id}/update-tournament` : '/planning/create-tournament'}" hx-target="body" hx-swap="outerHTML" hx-headers='{"Content-Type": "application/x-www-form-urlencoded"}' class="flex flex-col gap-4">
        ${isEdit ? `<input type="hidden" name="id" value="${id}">` : ''}
        <div>
          <label for="title" class="block mb-1">Title:</label>
          <input type="text" id="title" name="title" value="${title}" required class="w-full p-2 border rounded">
        </div>
        <div>
          <label for="date" class="block mb-1">Date:</label>
          <input type="date" id="date" name="date" value="${date}" required class="w-full p-2 border rounded">
        </div>
        <div>
          <label for="location" class="block mb-1">Location:</label>
          <input type="text" id="location" name="location" value="${location}" required class="w-full p-2 border rounded">
        </div>
        <div>
          <label for="lat" class="block mb-1">Latitude (optional):</label>
          <input type="number" id="lat" name="lat" step="any" value="${lat}" class="w-full p-2 border rounded">
        </div>
        <div>
          <label for="lon" class="block mb-1">Longitude (optional):</label>
          <input type="number" id="lon" name="lon" step="any" value="${lon}" class="w-full p-2 border rounded">
        </div>
        <div class="flex gap-2">
          <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">${isEdit ? 'Update' : 'Create'}</button>
          <a href="/" hx-get="/" hx-target="body" hx-swap="outerHTML" class="text-blue-600 underline">Cancel</a>
        </div>
      </form>
    </div>
  `;
};
