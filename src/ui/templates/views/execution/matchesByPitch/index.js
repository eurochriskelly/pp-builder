const { 
  generateTableCell, 
  generateIdCell,
  generateTeamCell,
  generateScoreCell,
  // generateTableHeaderRow, // No longer needed directly
  generateSpanningHeaderRow,
  generateTable // Import the new utility
} = require('../../../partials/utils');


// This function now serves as the rowGenerator for generateTable
function generateMatchRow(row) {
    const rowClass = row.started === 'true' ? 'match-started font-bold' : ''; // Add class for started matches
    let html = `<tr class="${rowClass}">`; // Use class instead of style
    html += generateIdCell(row.id);
    html += generateTableCell(row.pitch);
    html += generateTableCell(row.stage);
    html += generateTableCell(row.scheduledTime); // '🕒'
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
    let html = '<div id="matches-by-pitch">';
    
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

    // Group data by pitch
    const groupedData = data.reduce((acc, row) => {
        const pitch = row.pitch || 'Unknown Pitch';
        if (!acc[pitch]) {
            acc[pitch] = [];
        }
        acc[pitch].push(row);
        return acc;
    }, {});

    // Generate a table for each pitch
    for (const pitch in groupedData) {
        const pitchData = groupedData[pitch];
        // Use class for pitch header background and alignment (text-center is default now)
        html += generateSpanningHeaderRow(`Pitch ${pitch}`, headersConfig.length, 'bg-pitch-header'); 
        
        // Generate the table for this pitch's matches
        html += generateTable({
            data: pitchData,
            headersConfig: headersConfig,
            rowGenerator: generateMatchRow,
            tableClassName: '', // Add classes if needed
            emptyDataMessage: `No matches scheduled for Pitch ${pitch}.` // Should not happen if pitch exists in groupedData
        });
    }

    if (Object.keys(groupedData).length === 0) {
         html += '<p>No matches found.</p>'; // Message if there's no data at all
    }

    html += '</div>';
    return html;
};
