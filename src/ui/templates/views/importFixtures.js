module.exports = function generateImportFixtures(tournamentId, csvData = null, validationResult = null) {
    let html = `
        <div id="import-fixtures" style="padding: 20px; max-width: 1200px; margin: 0 auto;">
            <h2>Import Fixtures for Tournament ${tournamentId}</h2>
            <p>Upload a CSV file to import fixtures for this tournament.</p>
            <form hx-post="/planning/${tournamentId}/import-fixtures" hx-target="#import-fixtures" hx-swap="outerHTML" enctype="multipart/form-data">
                <div style="margin-bottom: 15px;">
                    <label for="file">CSV File:</label><br>
                    <input type="file" id="file" name="file" accept=".csv" required style="width: 100%;">
                </div>
                <button type="submit" style="background-color: #27ae60; color: white; padding: 10px 20px; border: none; border-radius: 5px;">Upload</button>
                <a href="/planning/${tournamentId}" hx-get="/planning/${tournamentId}" hx-target="body" hx-swap="outerHTML" style="margin-left: 10px;">Cancel</a>
            </form>
    `;

    if (csvData) {
        html += `
            <h3>Uploaded CSV Data</h3>
            <form hx-post="/planning/${tournamentId}/validate-fixtures" hx-target="#import-fixtures" hx-swap="outerHTML">
                <input type="hidden" name="csvData" value="${encodeURIComponent(JSON.stringify(csvData))}">
                <button type="submit" style="background-color: #3498db; color: white; padding: 10px 20px; border: none; border-radius: 5px; margin-top: 10px;">Validate</button>
            </form>
            <table style="margin-top: 20px;">
                <tr>
                    <th>Match ID</th><th>Start Time</th><th>Pitch</th><th>Stage</th><th>Category</th><th>Group</th>
                    <th>Team 1</th><th>Team 2</th><th>Umpire Team</th><th>Duration</th>
                </tr>
        `;
        csvData.forEach(row => {
            html += `
                <tr>
                    <td>${row.matchId || ''}</td>
                    <td>${row.startTime || ''}</td>
                    <td>${row.pitch || ''}</td>
                    <td>${row.stage || ''}</td>
                    <td>${row.category || ''}</td>
                    <td>${row.group || ''}</td>
                    <td>${row.team1 || ''}</td>
                    <td>${row.team2 || ''}</td>
                    <td>${row.umpireTeam || ''}</td>
                    <td>${row.duration || ''}</td>
                </tr>
            `;
        });
        html += '</table>';

        if (validationResult) {
            const { warnings, props } = validationResult;
            if (warnings && warnings.length > 0) {
                html += `
                    <h3>Warnings</h3>
                    <table style="margin-top: 20px; background-color: #ffe6e6;">
                        <tr><th>Warning</th></tr>
                `;
                warnings.forEach(warning => {
                    html += `<tr><td>${warning}</td></tr>`;
                });
                html += '</table>';
            } else {
                html += '<p style="color: green; margin-top: 20px;">No warnings found. Data looks valid.</p>';
            }

            // Summary Info
            html += `
                <h3>Summary</h3>
                <p><strong>Categories:</strong> ${props.categories.join(', ')}</p>
                <p><strong>Pitches:</strong> ${props.pitches.join(', ')}</p>
                <p><strong>Groups:</strong> ${Object.keys(props.groups.byCategory).map(cat => `${cat}: ${props.groups.byCategory[cat].join(', ')}`).join('; ')}</p>
                <p><strong>Teams:</strong> ${Object.keys(props.teams.byCategory).map(cat => `${cat}: ${props.teams.byCategory[cat].join(', ')}`).join('; ')}</p>
            `;
        }
    }

    html += '</div>';
    return html;
};
