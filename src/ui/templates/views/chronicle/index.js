/*
The regions should be show as:

| Region | Years | 
| Benelux | 2025 2024 2023 |
| France | 2025 2024 2023 |

*/

module.exports = function(regions) {
    let html = '<h1>Regions</h1>';
    html += '<table border="1">';

    regions.forEach(region => {
        // Extract years as array from object keys and sort them
        const yearsList = Object.keys(region.years).sort((a, b) => b - a);

        // Get championships from first year to determine columns
        const championships = yearsList.length > 0
            ? region.years[yearsList[0]].map(c => c.championship)
            : [];

        // Region header row with championships as column headers
        html += `<tr>
            <th rowspan="1">Region</th>
            <th>Year</th>`;

        championships.forEach(championship => {
            html += `<th colspan="2">${championship}</th>`;
        });

        html += `</tr>`;

        // Region name with link in first row
        html += `<tr>
            <td rowspan="${yearsList.length * 2}"><a href="/chronicle/${region.name}">${region.name}</a></td>`;

        // Iterate through each year
        yearsList.forEach((year, yearIndex) => {
            if (yearIndex > 0) {
                html += `<tr>`;
            }

            // Year with link
            html += `<td><a href="/chronicle/${region.name}/${year}">${year}</a></td>`;

            // Championships for this year
            region.years[year].forEach(championship => {
                html += `<td>Winner: ${championship.winner}</td>
                        <td>Runner up: ${championship.runnerUp}</td>`;
            });

            html += `</tr>`;

            // Add empty row for spacing
            if (yearIndex < yearsList.length - 1) {
                html += `<tr><td colspan="${championships.length * 2 + 1}">&nbsp;</td></tr>`;
            }
        });
    });

    html += '</table>';
    return html;
};