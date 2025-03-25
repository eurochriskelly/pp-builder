module.exports = function generateGroupStandings(data) {
    let html = '<div id="group-standings">';
    for (const cat of Object.keys(data)) {
        html += `
          <tr>
            <th colspan="8" class="category-header">
              <h2>${cat.toUpperCase()}</h2>
            </th>
          </tr>
        `;
        for (const groupData of data[cat]) {
            groupData.rows.sort((a, b) => {
                if (b.TotalPoints !== a.TotalPoints) return b.TotalPoints - a.TotalPoints;
                if (b.PointsDifference !== a.PointsDifference) return b.PointsDifference - a.PointsDifference;
                return b.PointsFrom - a.PointsFrom;
            });
            html += '<table class="standings-table" style="table-layout: fixed;">';
            html += `
                <colgroup>
                    <col class="col-team">
                    <col class="col-stat">
                    <col class="col-stat">
                    <col class="col-stat">
                    <col class="col-stat">
                    <col class="col-stat-wide">
                    <col class="col-stat-wide">
                    <col class="col-stat-wide">
                </colgroup>
                <tr><th colspan="8" class="group-header">Group ${groupData.groupName}</th></tr>
                <tr>${['Team', 'Played', 'Wins', 'Draws', 'Losses', 'Scores For', 'Score diff', 'Points'].map((h, i) => 
                    `<th class="table-header ${i === 0 ? 'text-left' : 'vertical-head'}">${h}</th>`
                ).join('')}</tr>
            `;
            for (const row of groupData.rows) {
                html += '<tr>';
                html += `<td class="uppercase font-bold" style="text-align: left;">${row.team}</td>`;
                html += `<td style="text-align: center;">${row.MatchesPlayed}</td>`;
                html += `<td style="text-align: center;">${row.Wins}</td>`;
                html += `<td style="text-align: center;">${row.Draws}</td>`;
                html += `<td style="text-align: center;">${row.Losses}</td>`;
                html += `<td style="text-align: center;">${row.PointsFrom}</td>`;
                html += `<td style="text-align: center;">${row.PointsDifference}</td>`;
                html += `<td style="text-align: center;">${row.TotalPoints}</td>`;
                html += '</tr>';
            }
            html += '</table>';
        }
    }
    html += '</div>';
    return html;
};
