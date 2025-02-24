const { processTeamName, formatScore } = require('../../../utils');

module.exports = function generateMatchesPlanning(data) {
    let html = '<div id="planning-matches">';
    html += '<h2>Simulate running tournament</h2>';
    html += '<p>Simulate tournament scenarios by playing upcoming matches.</p>';

    html += '<div style="margin-bottom: 20px;">';
    html += '<button style="background-color: #e74c3c;" hx-get="/planning/' + data.tournamentId + '/reset" hx-target="#planning-matches" hx-swap="outerHTML" hx-trigger="click" hx-on::after-request="htmx.ajax(\'GET\', \'/planning/' + data.tournamentId + '\', \'#planning-matches\')">Reset Tournament</button> ';
    html += '<button hx-post="/planning/' + data.tournamentId + '/simulate/1" hx-target="#planning-matches" hx-swap="outerHTML">Play Next Match</button> ';
    html += '<button hx-post="/planning/' + data.tournamentId + '/simulate/5" hx-target="#planning-matches" hx-swap="outerHTML">Play Next 5 Matches</button> ';
    html += '<button hx-post="/planning/' + data.tournamentId + '/simulate/10" hx-target="#planning-matches" hx-swap="outerHTML">Play Next 10 Matches</button>';
    html += '</div>';
    
    // results table
    html += '<table>';
    const headers = ['ID', 'Category', 'Group', 'Stage', 'Pitch', 'Time', 'Team 1', 'Score', 'Team 2', 'Score', 'Umpire', 'Started'];
    html += `<tr>${headers.map(h => h === 'ID' ? `<th class="id-column">${h}</th>` : `<th>${h}</th>`).join('')}</tr>`;
    data.matches.forEach(row => {
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
