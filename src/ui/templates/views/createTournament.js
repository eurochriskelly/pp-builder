module.exports = function generateCreateTournament() {
    return `
        <div id="create-tournament-form" style="padding: 20px; max-width: 600px; margin: 0 auto;">
            <h2>Create a New Tournament</h2>
            <form hx-post="/create-tournament" hx-target="body" hx-swap="outerHTML" hx-headers='{"Content-Type": "application/x-www-form-urlencoded"}'>
                <div style="margin-bottom: 15px;">
                    <label for="title">Title:</label><br>
                    <input type="text" id="title" name="title" required style="width: 100%; padding: 8px;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label for="date">Date:</label><br>
                    <input type="date" id="date" name="date" required style="width: 100%; padding: 8px;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label for="location">Location:</label><br>
                    <input type="text" id="location" name="location" required style="width: 100%; padding: 8px;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label for="lat">Latitude (optional):</label><br>
                    <input type="number" id="lat" name="lat" step="any" style="width: 100%; padding: 8px;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label for="lon">Longitude (optional):</label><br>
                    <input type="number" id="lon" name="lon" step="any" style="width: 100%; padding: 8px;">
                </div>
                <button type="submit" style="background-color: #27ae60; color: white; padding: 10px 20px; border: none; border-radius: 5px;">Create</button>
                <a href="/" hx-get="/" hx-target="body" hx-swap="outerHTML" style="margin-left: 10px;">Cancel</a>
            </form>
        </div>
    `;
};
