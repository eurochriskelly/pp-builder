const { 
  generateTableCell, 
  generateIdCell,
  generateTeamCell,
  generateScoreCell
} = require('../../../partials/tableUtils');
const { groupBy, generateGroupedTables } = require('../../../partials/groupUtils');

function generateMatchRow(row) {
    const rowClass = row.started === 'true' ? 'match-started font-bold' : '';
    let html = `<tr class="${rowClass}">`;
    html += generateIdCell(row.id);
    html += generateTableCell(row.pitch);
    html += generateTableCell(row.stage);
    html += generateTableCell(row.scheduledTime);
    html += generateTableCell(row.category);
    html += generateTeamCell(row.team1);
    html += generateScoreCell(row.goals1, row.points1);
    html += generateTeamCell(row.team2);
    html += generateScoreCell(row.goals2, row.points2);
    html += generateTeamCell(row.umpireTeam);
    html += '</tr>';
    return html;
}

module.exports = function generateMatchesByPitch(data) {
    const headersConfig = [
        { key: 'id', label: 'ID', className: 'id-column' },
        { key: 'pitch', label: 'Pitch' },
        { key: 'stage', label: 'Stage' },
        { key: 'scheduledTime', label: '🕒' },
        { key: 'category', label: 'Category' },
        { key: 'team1', label: 'Team 1' },
        { key: 'score1', label: 'Score 1' },
        { key: 'team2', label: 'Team 2' },
        { key: 'score2', label: 'Score 2' },
        { key: 'umpireTeam', label: 'Umpire Team' }
    ];

    const groupedData = groupBy(data, 'pitch', 'Unknown Pitch');
    const html = generateGroupedTables(
        groupedData,
        generateMatchRow,
        headersConfig,
        pitch => `Pitch ${pitch}`,
        'No matches found'
    );

    return `<div id="matches-by-pitch">${html}</div>`;
};
