const { formatScore } = require('../../../../../utils');
require('../../../../../public/scripts/webcomponents/knockout-level.js'); // Import the component

// Inline CSS for row and play button
const rowStyleBase = ` position: relative; transition: background-color 0.2s; `;
const playButtonStyle = `
    position: absolute;
    left: 5px;
    top: 50%;
    transform: translateY(-50%);
    background-color: #27ae60;
    color: white;
    border: none;
    border-radius: 50%;
    width: 31.2px;
    height: 31.2px;
    font-size: 18.72px;
    cursor: pointer;
    display: none;
    padding: 0;
    text-align: center;
    line-height: 31.2px;
`;

module.exports = {
    generateUpcomingRow,
    generateFinishedRow,
}

// ----- Helper Functions for Modular HTML Generation -----
function generateUpcomingRow(
    row,
    index,
    tournamentId,
    isHidden,
    firstMatchId
)
{
    const isNext = row.id === firstMatchId;
    const backgroundColor = isNext
        ? 'lightblue'
        : (index % 2 === 0 ? '#f1f1f1' : '#e1e1e1');
    const displayStyle = isHidden ? 'display: none;' : '';
    const rowStyle = `${rowStyleBase} background-color: ${backgroundColor}; ${displayStyle}`;
    const categoryColor = getRandomColor(row.category);
    const pitchColor = getRandomColor(row.pitch);
    const team1CellStyle = (row.team1 === 'TBD' && row.stage !== 'group')
        ? 'background-color: rgba(255, 69, 0, 0.2);'
        : '';
    const team2CellStyle = (row.team2 === 'TBD' && row.stage !== 'group')
        ? 'background-color: rgba(255, 69, 0, 0.2);'
        : '';
    const umpireCellStyle = (row.umpireTeam === 'TBD' && row.stage !== 'group')
        ? 'background-color: rgba(255, 69, 0, 0.2);'
        : '';
    const category = row.category || 'Uncategorized';

    return `<tr style="${rowStyle}" data-category="${category}" onmouseover="this.querySelector('.play-btn').style.display='block';" onmouseout="this.querySelector('.play-btn').style.display='none';">
      <td style="position: relative; background-color: #808080; color: white;">
        <button class="play-btn" style="${playButtonStyle}" onclick="playNextNMatches(${index + 1}, '${tournamentId}')">▶</button>
        ${row.id ? row.id.toString().slice(-3) : 'N/A'}
      </td>
      <td><span style="${pillStyle(categoryColor)}">${row.category || 'N/A'}</span></td>
      <td><knockout-level match-id="${row.id || ''}" stage="${row.stage || ''}" category="${row.category || ''}"></knockout-level></td>
      <td><span style="${pillStyle(pitchColor)}">${row.pitch || 'N/A'}</span></td>
      <td>${row.scheduledTime || 'N/A'}</td>
      <td style="${team1CellStyle}"><team-name name="${row.team1}" maxchars="25"></team-name></td>
      <td style="${team2CellStyle}"><team-name name="${row.team2}" maxchars="25"></team-name></td>
      <td style="${umpireCellStyle}"><team-name name="${row.umpireTeam}" icon-only="true" showLogo="true"></team-name></td>
    </tr>`;
}

function generateFinishedRow(row, index, isHidden) {
    const backgroundColor = index % 2 === 0 ? '#f1f1f1' : '#e1e1e1';
    const displayStyle = isHidden ? 'display: none;' : '';
    const rowStyle = `background-color: ${backgroundColor}; ${displayStyle}`;
    const categoryColor = getRandomColor(row.category);
    const pitchColor = getRandomColor(row.pitch);
    const rawTeam1Score = formatScore(row.goals1, row.points1);
    const rawTeam2Score = formatScore(row.goals2, row.points2);
    let team1Score = rawTeam1Score.replace('</span> <span>', '</span><br/><span>');
    let team2Score = rawTeam2Score.replace('</span> <span>', '</span><br/><span>');
    const total1 = row.goals1 * 3 + row.points1;
    const total2 = row.goals2 * 3 + row.points2;
    if (total1 > total2) {
        team1Score = `<b>${team1Score}</b>`;
    } else if (total2 > total1) {
        team2Score = `<b>${team2Score}</b>`;
    }
    const score1Style = rawTeam1Score === 'N/A' ? 'color:grey; text-align:center;' : 'text-align:center;';
    const score2Style = rawTeam2Score === 'N/A' ? 'color:grey; text-align:center;' : 'text-align:center;';
    const category = row.category || 'Uncategorized';

    return `<tr style="${rowStyle}" data-category="${category}">
      <td style="background-color: #808080; color: white;">${row.id ? row.id.toString().slice(-3) : 'N/A'}</td>
      <td><span style="${pillStyle(categoryColor)}">${row.category || 'N/A'}</span></td>
      <td><knockout-level match-id="${row.id || ''}" stage="${row.stage || ''}" category="${row.category || ''}"></knockout-level></td>
      <td><span style="${pillStyle(pitchColor)}">${row.pitch || 'N/A'}</span></td>
      <td>${row.scheduledTime || 'N/A'}</td>
      <td><team-name direction="r2l" name="${row.team1}" maxchars="25"></team-name></td>
      <td style="${score1Style}">${team1Score}</td>
      <td style="${score2Style}">${team2Score}</td>
      <td><team-name name="${row.team2}" maxchars="25"></team-name></td>
    </tr>`;
}


// Function to generate a consistent pastel color for categories/pitches or dark color for teams
function getRandomColor(name, isTeam = false) {
    const hash = hashString(name || 'unknown');
    const hue = hash % 360;
    return isTeam ? `hsl(${hue}, 50%, 30%)` : `hsl(${hue}, 40%, 75%)`;
}

// Style for pill-like display for categories and pitches
const pillStyle = (color) => `
    background-color: ${color};
    color: white;
    padding: 3px 10px;
    border-radius: 12px;
    display: inline-block;
    font-size: 0.85em;
    font-weight: bold;
    text-transform: uppercase;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

// Style for team names with transparent white pill background, no wrap, larger padding
const teamPillStyle = (color, isUmpire = false, isTBDNonGroup = false) => `
    color: ${color};
    ${isUmpire || isTBDNonGroup ? '' : 'background-color: rgba(255, 255, 255, 0.5); padding: 3.6px 10.8px; border-radius: 10px;'}
    display: inline-block;
    ${isUmpire || isTBDNonGroup ? '' : 'font-weight: bold;'}
    text-transform: uppercase;
    white-space: nowrap;
    ${isTBDNonGroup ? 'font-style: italic;' : ''}
`;

// Function to truncate team names longer than 25 characters
function truncateTeamName(name) {
    return name.length > 25 ? `${name.substring(0, 22)}...` : name;
}

// Improved hash function for better distribution
function hashString(str) {
    let hash = 17;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 23 + str.charCodeAt(i)) & 0xFFFFFFFF;
    }
    return hash;
}
