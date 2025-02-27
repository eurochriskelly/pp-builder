const { processTeamName, formatScore } = require('../../../utils');

module.exports = function generateMatchesPlanning(data) {
    let html = '<div id="planning-matches">';
    html += '<h2>Simulate running tournament</h2>';
    html += '<p>Simulate tournament scenarios by playing upcoming matches or import fixtures from a CSV.</p>';

    html += '<div style="margin-bottom: 20px;">';
    html += '<button style="background-color: #e74c3c;" hx-get="/planning/' + data.tournamentId + '/reset" hx-target="#planning-matches" hx-swap="outerHTML" hx-trigger="click" hx-on::after-request="htmx.ajax(\'GET\', \'/planning/' + data.tournamentId + '\', \'#planning-matches\')">Reset Tournament</button> ';
    html += '<button hx-post="/planning/' + data.tournamentId + '/simulate/1" hx-target="#planning-matches" hx-swap="outerHTML">Play Next Match</button> ';
    html += '<button hx-post="/planning/' + data.tournamentId + '/simulate/5" hx-target="#planning-matches" hx-swap="outerHTML">Play Next 5 Matches</button> ';
    html += '<button hx-post="/planning/' + data.tournamentId + '/simulate/10" hx-target="#planning-matches" hx-swap="outerHTML">Play Next 10 Matches</button> ';
    html += '<button hx-get="/planning/' + data.tournamentId + '/import-fixtures" hx-target="body" hx-swap="outerHTML" style="background-color: #e67e22; color: white; margin-left: 10px;">Import Fixtures</button>';
    html += '</div>';

    // Split matches into upcoming and finished
    const upcomingMatches = data.matches
        .filter(match => match.started === 'false')
        .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime)); // Sort by scheduledTime ascending
    const finishedMatches = data.matches.filter(match => match.started === 'true');

    // Upcoming Games table
    html += '<h3>Upcoming Games</h3>';
    html += '<table>';
    const headers = ['ID', 'Category', 'Group', 'Stage', 'Pitch', 'Time', 'Team 1', 'Team 2', 'Umpire' ];
    html += `<tr>${headers.map(h => h === 'ID' ? `<th class="id-column">${h}</th>` : `<th>${h}</th>`).join('')}</tr>`;
    upcomingMatches.forEach(row => {
        html += '<tr>';
        html += `<td class="id-column">${row.id ? row.id.toString().slice(-3) : 'N/A'}</td>`;
        html += `<td>${row.category || 'N/A'}</td>`;
        html += `<td>${row.grp || 'N/A'}</td>`;
        html += `<td>${row.stage || 'N/A'}</td>`;
        html += `<td>${row.pitch || 'N/A'}</td>`;
        html += `<td>${row.scheduledTime || 'N/A'}</td>`;
        const { teamName: team1Name, teamStyle: team1Style } = processTeamName(row.team1);
        const { teamName: team2Name, teamStyle: team2Style } = processTeamName(row.team2);
        html += `<td style="${team1Style}">${team1Name || 'N/A'}</td>`;
        html += `<td style="${team2Style}">${team2Name || 'N/A'}</td>`;
        const { teamName: umpireTeamName, teamStyle: umpireTeamStyle } = processTeamName(row.umpireTeam);
        html += `<td style="${umpireTeamStyle}">${umpireTeamName || 'N/A'}</td>`;
        html += '</tr>';
    });
    html += '</table>';

    // Finished Games table
    html += '<h3>Finished Games</h3>';
    html += '<table style="margin-top: 20px;">';
    html += `<tr>${headers.map(h => h === 'ID' ? `<th class="id-column">${h}</th>` : `<th>${h}</th>`).join('')}</tr>`;
    finishedMatches.forEach(row => {
        html += '<tr>';
        html += `<td class="id-column">${row.id ? row.id.toString().slice(-3) : 'N/A'}</td>`;
        html += `<td>${row.category || 'N/A'}</td>`;
        html += `<td>${row.grp || 'N/A'}</td>`;
        html += `<td>${row.stage || 'N/A'}</td>`;
        html += `<td>${row.pitch || 'N/A'}</td>`;
        html += `<td>${row.scheduledTime || 'N/A'}</td>`;
        const { teamName: team1Name, teamStyle: team1Style } = processTeamName(row.team1);
        const { teamName: team2Name, teamStyle: team2Style } = processTeamName(row.team2);
        const team1Score = formatScore(row.goals1, row.points1);
        const team2Score = formatScore(row.goals2, row.points2);
        const score1Style = team1Score === 'N/A' ? 'color:grey;' : '';
        const score2Style = team2Score === 'N/A' ? 'color:grey;' : '';
        html += `<td style="${team1Style}">${team1Name || 'N/A'}</td>`;
        html += `<td style="${score1Style}">${team1Score}</td>`;
        html += `<td style="${team2Style}">${team2Name || 'N/A'}</td>`;
        html += `<td style="${score2Style}">${team2Score}</td>`;
        const { teamName: umpireTeamName, teamStyle: umpireTeamStyle } = processTeamName(row.umpireTeam);
        html += `<td style="${umpireTeamStyle}">${umpireTeamName || 'N/A'}</td>`;
        html += `<td>${row.started === 'true' ? 'Yes' : 'No'}</td>`;
        html += '</tr>';
    });
    html += '</table>';

    html += '</div>';
    return html;
};
