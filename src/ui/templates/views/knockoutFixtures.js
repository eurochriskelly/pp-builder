const { processTeamName, formatScore } = require('../../utils');

module.exports = function generateKnockoutFixtures(data) {
    let html = '<div id="knockout-fixtures">';
    let currentCategory = null;
    const headers = ['ID', 'Stage', 'Pitch', '🕒', 'Team 1', 'Score', 'Team 2', 'Score', 'Umpire Team'];
    
    data.forEach(row => {
        if (row.category !== currentCategory) {
            if (currentCategory !== null) html += '</table>';
            currentCategory = row.category;
            html += `
                <table>
                <tr><th colspan="${headers.length}" style="background-color: #d3d3d3; text-align: center;">${currentCategory}</th></tr>
                <tr>${headers.map(h => h === 'ID' ? `<th class="id-column">${h}</th>` : `<th>${h}</th>`).join('')}</tr>
            `;
        }
        const rowStyle = row.started === 'true' ? 'font-weight:bold;' : '';
        html += `<tr style="${rowStyle}">`;
        html += `<td class="id-column">${row.id ? row.id.toString().slice(-3) : 'N/A'}</td>`;
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
        html += '</tr>';
    });
    if (currentCategory !== null) html += '</table>';
    html += '</div>';
    return html;
};
