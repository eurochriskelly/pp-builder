/*
The regions should be show as:

| Region | Years | 
| Benelux | 2025 2024 2023 |
| France | 2025 2024 2023 |

*/

module.exports = function(regions) {
    let html = '<h1>Regions</h1>';
    html += '<table border="1"><thead><tr><th>Region</th><th>Years</th></tr></thead><tbody>';
    regions.forEach(region => {
        const years = region.years ? region.years.join(' ') : '';
        const yearLinks = region.years
            ? region.years.map(year => `<a href="/chronicle/${region.name}/${year}">${year}</a>`).join(' ')
            : '';
        html += `
          <tr>
            <td><a href="/chronicle/${region.name}">${region.name}</a></td>
            <td>${yearLinks}</td>
          </tr>`;
    });
    html += '</tbody></table>';
    return html;
};