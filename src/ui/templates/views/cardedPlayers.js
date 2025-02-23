module.exports = function generateCardedPlayers(data) {
    let html = '<div id="carded-players">';
    html += '<table>';
    const headers = ['Player Number', 'Player Name', 'Team', 'Card Color'];
    html += `<tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>`;
    data.forEach(row => {
        let cardColorStyle = '';
        switch (row.cardColor) {
            case 'yellow': cardColorStyle = 'color:gold;'; break;
            case 'red': cardColorStyle = 'color:red;'; break;
            case 'black': cardColorStyle = 'color:black;'; break;
            default: cardColorStyle = '';
        }
        html += '<tr>';
        html += `<td>${row.playerNumber || 'N/A'}</td>`;
        html += `<td>${row.playerName || 'N/A'}</td>`;
        html += `<td>${row.team || 'N/A'}</td>`;
        html += `<td style="${cardColorStyle}">${row.cardColor || 'N/A'}</td>`;
        html += '</tr>';
    });
    html += '</table>';
    html += '</div>';
    return html;
};
