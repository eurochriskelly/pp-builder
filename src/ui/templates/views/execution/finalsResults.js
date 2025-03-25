const { processTeamName, formatScore } = require('../../../utils');

module.exports = function generateFinalsResults(data) {
    let html = '<div id="finals-results">';
    let currentCategory = null;
    const headers = ['Level', 'Team 1', 'Score', 'Team 2', 'Score'];
    
    html += `<table class="finals-table">
             <colgroup>
                 <col class="col-level">
                 <col class="col-team">
                 <col class="col-score">
                 <col class="col-team">
                 <col class="col-score">
             </colgroup>
             <tr>${headers.map(h => `<th class="table-header">${h}</th>`).join('')}</tr>`;
    data.forEach(row => {
        if (row.category !== currentCategory) {
            currentCategory = row.category;
            html += `
                <tr><th colspan="${headers.length}" class="category-header">${currentCategory}</th></tr>
            `;
        }
        html += '<tr>';
        html += `<td>${row?.division?.toUpperCase() || 'N/A'}</td>`;
        const { teamName: team1Name, teamStyle: team1Style } = processTeamName(row.team1);
        const { teamName: team2Name, teamStyle: team2Style } = processTeamName(row.team2);
        const team1Score = formatScore(row.goals1, row.points1);
        const team2Score = formatScore(row.goals2, row.points2);
        let team1ScoreFinal = team1Score;
        let team2ScoreFinal = team2Score;
        if (row.outcome === 'not played') {
            if (row.goals1 === 0 && row.points1 === 0 && row.goals2 === 0 && row.points2 === 1) {
                team1ScoreFinal = 'concede';
                team2ScoreFinal = 'walked';
            } else if (row.goals2 === 0 && row.points2 === 0 && row.goals1 === 0 && row.points1 === 1) {
                team1ScoreFinal = 'walked';
                team2ScoreFinal = 'concede';
            } else if (row.goals1 === 0 && row.points1 === 0 && row.goals2 === 0 && row.points2 === 0) {
                team1ScoreFinal = 'shared';
                team2ScoreFinal = 'shared';
            }
        }
        let winnerName = row.winner || 'N/A';
        let winnerStyle = '';
        if (winnerName === 'Draw') {
            winnerStyle = 'font-weight:bold; color:blue;';
        } else {
            const processedWinner = processTeamName(winnerName);
            winnerName = processedWinner.teamName;
            winnerStyle = processedWinner.teamStyle;
        }
        const extractScore = score => {
            const match = score.match(/\((\d+)\)/);
            return match ? parseInt(match[1], 10) : 0;
        };
        const score1Value = extractScore(team1ScoreFinal);
        const score2Value = extractScore(team2ScoreFinal);
        let team1ScoreClass = '', team2ScoreClass = '';
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
        html += `<td class="${team1ScoreClass}">${team1ScoreFinal || 'N/A'}</td>`;
        html += `<td class="${team2ScoreClass} ${team2WinnerClass}" style="${team2Style}">${team2Name || 'N/A'}</td>`;
        html += `<td class="${team2ScoreClass}">${team2ScoreFinal || 'N/A'}</td>`;
        html += '</tr>';
    });
    html += '</table>';
    html += '</div>';
    return html;
};
