module.exports = function generateGroupStandings(data) {
    let html = '<div id="group-standings">';
    for (const cat of Object.keys(data)) {
        html += `<tr><th colspan="8" style="background-color: #d3d3d3; text-align: center;"><h2>${cat}</h2></th></tr>`;
        for (const groupData of data[cat]) {
            groupData.rows.sort((a, b) => {
                if (b.TotalPoints !== a.TotalPoints) return b.TotalPoints - a.TotalPoints;
                if (b.PointsDifference !== a.PointsDifference) return b.PointsDifference - a.PointsDifference;
                return b.PointsFrom - a.PointsFrom;
            });
            html += '<table>';
            html += `
                <tr><th colspan="8" style="background-color: #e6e6e6; text-align: center;">Group ${groupData.groupName}</th></tr>
                <tr>${['Team', 'Played', 'Wins', 'Draws', 'Losses', 'Scores For', 'Score diff', 'Points'].map(h => `<th>${h}</th>`).join('')}</tr>
            `;
            for (const row of groupData.rows) {
                html += '<tr>';
                html += `<td>${row.team}</td>`;
                html += `<td>${row.MatchesPlayed}</td>`;
                html += `<td>${row.Wins}</td>`;
                html += `<td>${row.Draws}</td>`;
                html += `<td>${row.Losses}</td>`;
                html += `<td>${row.PointsFrom}</td>`;
                html += `<td>${row.PointsDifference}</td>`;
                html += `<td>${row.TotalPoints}</td>`;
                html += '</tr>';
            }
            html += '</table>';
        }
    }
    html += '</div>';
    return html;
};
