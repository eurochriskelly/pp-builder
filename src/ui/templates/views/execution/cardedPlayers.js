const {
    generateTableCell,
    // generateTableHeaderRow, // No longer needed directly
    getCardColorStyle,
    generateTable // Import the new utility
} = require('../../partials/utils');
const { processTeamName } = require('../../../utils'); // For consistent team styling

// Row generator function for carded players
function generateCardedPlayerRow(row) {
    const cardColorClass = getCardColorStyle(row.cardColor); // Get class name
    const { teamName, teamStyle } = processTeamName(row.team); // Use consistent team styling

    let html = '<tr>';
    html += generateTableCell(row.playerNumber);
    html += generateTableCell(row.playerName);
    html += generateTableCell(teamName, '', teamStyle); // Apply team style (dynamic)
    html += generateTableCell(row.cardColor, cardColorClass); // Pass class
    html += '</tr>';
    return html;
}

module.exports = function generateCardedPlayers(data) {
    let html = '<div id="carded-players">';

    const headersConfig = [
        { key: 'playerNumber', label: 'Player Number' },
        { key: 'playerName', label: 'Player Name' },
        { key: 'team', label: 'Team' },
        { key: 'cardColor', label: 'Card Color' }
    ];

    html += generateTable({
        data: data,
        headersConfig: headersConfig,
        rowGenerator: generateCardedPlayerRow,
        tableClassName: '', // Add classes if needed
        emptyDataMessage: 'No carded players recorded.'
    });

    html += '</div>';
    return html;
};
