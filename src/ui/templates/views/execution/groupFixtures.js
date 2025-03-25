const { processTeamName, formatScore } = require('../../../utils');

module.exports = function generateGroupFixtures(data) {
    let html = '<div id="group-fixtures">';
    
    const headers = ['Team 1', 'Score', 'Team 2', 'Score'];
    let currentCategory = null;

    data.forEach(row => {
        if (row.category !== currentCategory) {
            if (currentCategory !== null) html += '</table>';
            currentCategory = row.category;
            html += `
                <table>
                <tr><th colspan="${headers.length}" class="category-header">${currentCategory}</th></tr>
                <tr>${headers.map(h => `<th class="table-header">${h}</th>`).join('')}</tr>
            `;
        }

        html += '<tr>';

        const { teamName: team1Name, teamStyle: team1Style } = processTeamName(row.team1);
        const { teamName: team2Name, teamStyle: team2Style } = processTeamName(row.team2);
        const team1Score = formatScore(row.goals1, row.points1);
        const team2Score = formatScore(row.goals2, row.points2);
        const score1Style = team1Score === 'N/A' ? 'text-gray-400' : '';
        const score2Style = team2Score === 'N/A' ? 'text-gray-400' : '';

        const extractScore = score => {
            const match = score.match(/\((\d+)\)/);
            return match ? parseInt(match[1], 10) : 0;
        };
        const score1Value = extractScore(team1Score);
        const score2Value = extractScore(team2Score);
        let team1ScoreClass = '', team2ScoreClass = '';
        const team1Bold = score1Value > score2Value ? 'font-weight:bold;' : '';
        const team2Bold = score2Value > score1Value ? 'font-weight:bold;' : '';
        if (score1Value > score2Value) {
            team1ScoreClass = 'score-winner';
            team2ScoreClass = 'score-loser';
        } else if (score1Value < score2Value) {
            team1ScoreClass = 'score-loser';
            team2ScoreClass = 'score-winner';
        } else {
            team1ScoreClass = team2ScoreClass = 'score-draw';
        }
        const team1WinnerClass = score1Value > score2Value ? 'team-winner' : '';
        const team2WinnerClass = score2Value > score1Value ? 'team-winner' : '';
        html += `<td class="${team1ScoreClass} ${team1WinnerClass}" style="${team1Style}">${team1Name || 'N/A'}</td>`;
        html += `<td class="${team1ScoreClass} ${score1Style}">${team1Score}</td>`;
        html += `<td class="${team2ScoreClass} ${team2WinnerClass}" style="${team2Style}">${team2Name || 'N/A'}</td>`;
        html += `<td class="${team2ScoreClass} ${score2Style}">${team2Score}</td>`;
        html += '</tr>';
    });

    if (currentCategory !== null) html += '</table>';
    html += '</div>';

    return html;
};
