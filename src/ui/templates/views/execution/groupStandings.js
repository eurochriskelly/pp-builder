module.exports = function generateGroupStandings(data) {
    let html = '<div id="group-standings">';
    for (const cat of Object.keys(data)) {
        html += `
          <tr>
            <th colspan="8" style="background-color: #d3d3d3; text-align: center;"> 
              <h2 style="text-align:center;font-weight:bold;font-size:2rem;">${cat.toUpperCase()}</h2>
            </th>
          </tr>
        `;
        for (const groupData of data[cat]) {
            groupData.rows.sort((a, b) => {
                if (b.TotalPoints !== a.TotalPoints) return b.TotalPoints - a.TotalPoints;
                if (b.PointsDifference !== a.PointsDifference) return b.PointsDifference - a.PointsDifference;
                return b.PointsFrom - a.PointsFrom;
            });
            html += '<table style="width: 100%; table-layout: fixed;">';
            html += `
                <colgroup>
                    <col style="width: 38%">
                    <col style="width: 8%">
                    <col style="width: 8%">
                    <col style="width: 8%">
                    <col style="width: 8%">
                    <col style="width: 10%">
                    <col style="width: 10%">
                    <col style="width: 10%">
                </colgroup>
                <tr><th colspan="8" style="background-color: #e6e6e6; font-weight: normal; text-align: center; font-size: 1.7rem;">Group ${groupData.groupName}</th></tr>
                <tr>${['Team', 'Played', 'Wins', 'Draws', 'Losses', 'Scores For', 'Score diff', 'Points'].map((h, i) => 
                    `<th style="text-align: ${i === 0 ? 'left' : 'right'};color:#999;font-weight:normal">${h}</th>`
                ).join('')}</tr>
            `;
            for (const row of groupData.rows) {
                html += '<tr>';
                html += `<td style="text-align: left;">${row.team}</td>`;
                html += `<td style="text-align: right;">${row.MatchesPlayed}</td>`;
                html += `<td style="text-align: right;">${row.Wins}</td>`;
                html += `<td style="text-align: right;">${row.Draws}</td>`;
                html += `<td style="text-align: right;">${row.Losses}</td>`;
                html += `<td style="text-align: right;">${row.PointsFrom}</td>`;
                html += `<td style="text-align: right;">${row.PointsDifference}</td>`;
                html += `<td style="text-align: right;">${row.TotalPoints}</td>`;
                html += '</tr>';
            }
            html += '</table>';
        }
    }
    html += '</div>';
    return html;
};
