const { processTeamName } = require('../../utils');

module.exports = function generateRecentView(data, count) {
    const headers = ['ID', 'Start', 'Pitch', '👥', 'Stage', 'Competition', 'Team 1', 'Score 1', 'Team 2', 'Score 2', 'Umpire Team'];
    let html = `<h2>Number of matches started: ${count}</h2>`;
    html += '<table hx-get="/" hx-trigger="every 30s" hx-swap="outerHTML"><tr>';
    headers.forEach(header => {
        html += header === 'ID' ? `<th class="id-column">${header}</th>` : `<th>${header}</th>`;
    });
    html += '</tr>';
    data.forEach(row => {
        html += '<tr>';
        let idCell = row.id ? row.id.toString().slice(-3) : 'N/A';
        html += `<td class="id-column">${idCell}</td>`;
        html += `<td>${row.start || 'N/A'}</td>`;
        html += `<td>${row.pitch || 'N/A'}</td>`;
        html += `<td>${row.grp || 'N/A'}</td>`;
        html += `<td>${row.stage || 'N/A'}</td>`;
        html += `<td>${row.competition || 'N/A'}</td>`;
        let { teamName: team1Name, teamStyle: team1Style } = processTeamName(row.team1);
        let { teamName: team2Name, teamStyle: team2Style } = processTeamName(row.team2);
        html += `<td style="${team1Style}">${team1Name || 'N/A'}</td>`;
        html += `<td>${row.score1 || 'N/A'}</td>`;
        html += `<td style="${team2Style}">${team2Name || 'N/A'}</td>`;
        html += `<td>${row.score2 || 'N/A'}</td>`;
        let { teamName: umpireTeamName, teamStyle: umpireTeamStyle } = processTeamName(row.umpireTeam);
        html += `<td style="${umpireTeamStyle}">${umpireTeamName || 'N/A'}</td>`;
        html += '</tr>';
    });
    html += '</table>';
    return html;
};
