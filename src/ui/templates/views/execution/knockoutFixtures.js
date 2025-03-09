const { processTeamName, formatScore } = require('../../../utils');

module.exports = function generateKnockoutFixtures(data) {
    let html = '<div id="knockout-fixtures">';
    let currentCategory = null;
    const headers = ['Stage', '🕒', 'Team 1', 'Score', 'Team 2', 'Score', 'Umpire Team'];
    
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
        html += `<td>${row.stage || 'N/A'}</td>`;
        html += `<td>${row.scheduledTime || 'N/A'}</td>`;
        const { teamName: team1Name, teamStyle: team1Style } = processTeamName(row.team1);
        const { teamName: team2Name, teamStyle: team2Style } = processTeamName(row.team2);
        let team1Score = formatScore(row.goals1, row.points1);
        let team2Score = formatScore(row.goals2, row.points2);
        if (row.outcome === 'not played') {
            if (row.goals1 === 0 && row.points1 === 0 && row.goals2 === 0 && row.points2 === 1) {
                team1Score = 'concede';
                team2Score = 'walked';
            } else if (row.goals2 === 0 && row.points2 === 0 && row.goals1 === 0 && row.points1 === 1) {
                team1Score = 'walked';
                team2Score = 'concede';
            } else if (row.goals1 === 0 && row.points1 === 0 && row.goals2 === 0 && row.points2 === 0) {
                team1Score = 'shared';
                team2Score = 'shared';
            }
        }
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
