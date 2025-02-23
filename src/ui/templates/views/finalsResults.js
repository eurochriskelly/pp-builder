const { processTeamName, formatScore } = require('../../utils');

module.exports = function generateFinalsResults(data) {
    let html = '<div id="finals-results">';
    let currentCategory = null;
    const headers = ['Division', 'Team 1', 'Score', 'Team 2', 'Score', 'Winner'];
    
    html += `<table><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>`;
    data.forEach(row => {
        if (row.category !== currentCategory) {
            currentCategory = row.category;
            html += `
                <tr><th colspan="${headers.length}" style="background-color: #d3d3d3; text-align: center;">${currentCategory}</th></tr>
            `;
        }
        html += '<tr>';
        html += `<td>${row.division || 'N/A'}</td>`;
        const { teamName: team1Name, teamStyle: team1Style } = processTeamName(row.team1);
        const { teamName: team2Name, teamStyle: team2Style } = processTeamName(row.team2);
        const team1Score = formatScore(row.goals1, row.points1);
        const team2Score = formatScore(row.goals2, row.points2);
        let winnerName = row.winner || 'N/A';
        let winnerStyle = '';
        if (winnerName === 'Draw') {
            winnerStyle = 'font-weight:bold; color:blue;';
        } else {
            const processedWinner = processTeamName(winnerName);
            winnerName = processedWinner.teamName;
            winnerStyle = processedWinner.teamStyle;
        }
        html += `<td style="${team1Style}">${team1Name || 'N/A'}</td>`;
        html += `<td>${team1Score || 'N/A'}</td>`;
        html += `<td style="${team2Style}">${team2Name || 'N/A'}</td>`;
        html += `<td>${team2Score || 'N/A'}</td>`;
        html += `<td style="${winnerStyle}">${winnerName}</td>`;
        html += '</tr>';
    });
    html += '</table>';
    html += '</div>';
    return html;
};
