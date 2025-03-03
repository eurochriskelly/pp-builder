const { processTeamName, formatScore } = require('../../../../../utils');

function isNextMatch(match, upcomingMatches) {
  return match.id === upcomingMatches[0].id;
}

function processStage(stage) {
  if (stage !== 'group') {
    const parts = stage.split('_');
    if (parts.length === 2) {
      return `<b>${parts[0]}:</b>${parts[1]}`;
    }
  }
  return stage;
}

function hashString(str) {
  let hash = 17;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 23 + str.charCodeAt(i)) & 0xFFFFFFFF;
  }
  return hash;
}

function getRandomColor(name, isTeam = false) {
  const hash = hashString(name || 'unknown');
  const hue = hash % 360;
  return isTeam ? `hsl(${hue}, 50%, 30%)` : `hsl(${hue}, 40%, 75%)`;
}

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

const teamPillStyle = (color, isUmpire = false, isTBDNonGroup = false) => `
  color: ${color};
  ${isUmpire || isTBDNonGroup ? '' : 'background-color: rgba(255, 255, 255, 0.5); padding: 3.6px 10.8px; border-radius: 10px;'}
  display: inline-block;
  ${isUmpire || isTBDNonGroup ? '' : 'font-weight: bold;'}
  text-transform: uppercase;
  white-space: nowrap;
  ${isTBDNonGroup ? 'font-style: italic;' : ''}
`;

function truncateTeamName(name) {
  return name.length > 25 ? `${name.substring(0, 22)}...` : name;
}

function getGroupBackground(stage) {
  return stage === 'group' ? 'background-color: rgba(255, 235, 204, 0.8);' : 'background-color: rgba(230, 255, 230, 0.8);';
}

const rowStyleBase = `
  position: relative;
  transition: background-color 0.2s;
`;

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

function generateMatchRow(row, index, tournamentId, isUpcoming, isNext = false) {
  const rowStyle = isNext
    ? `${rowStyleBase} background-color: lightblue;${index >= 10 ? ' display: none;' : ''}`
    : `${rowStyleBase} background-color: ${index % 2 === 0 ? '#f1f1f1' : '#e1e1e1'};${index >= 10 ? ' display: none;' : ''}`;
  const categoryColor = getRandomColor(row.category);
  const pitchColor = getRandomColor(row.pitch);
  const team1Color = row.team1 === 'TBD' && row.stage !== 'group' ? '#ff4500' : getRandomColor(row.team1, true);
  const team2Color = row.team2 === 'TBD' && row.stage !== 'group' ? '#ff4500' : getRandomColor(row.team2, true);
  const umpireColor = row.umpireTeam === 'TBD' && row.stage !== 'group' ? '#ff4500' : getRandomColor(row.umpireTeam, true);
  const team1Style = row.team1 === 'TBD' && row.stage !== 'group' ? teamPillStyle(team1Color, false, true) : teamPillStyle(team1Color);
  const team2Style = row.team2 === 'TBD' && row.stage !== 'group' ? teamPillStyle(team2Color, false, true) : teamPillStyle(team2Color);
  const umpireStyle = row.umpireTeam === 'TBD' && row.stage !== 'group' ? teamPillStyle(umpireColor, true, true) : teamPillStyle(umpireColor, true);
  const team1CellStyle = row.team1 === 'TBD' && row.stage !== 'group' ? 'background-color: rgba(255, 69, 0, 0.2);' : '';
  const team2CellStyle = row.team2 === 'TBD' && row.stage !== 'group' ? 'background-color: rgba(255, 69, 0, 0.2);' : '';
  const umpireCellStyle = row.umpireTeam === 'TBD' && row.stage !== 'group' ? 'background-color: rgba(255, 69, 0, 0.2);' : '';

  let html = `<tr style="${rowStyle}" class="${isUpcoming ? 'upcoming-hidden-row' : 'finished-hidden-row'}" ${isUpcoming ? `onmouseover="this.querySelector('.play-btn').style.display='block';" onmouseout="this.querySelector('.play-btn').style.display='none';"` : ''}>`;
  html += `<td style="position: relative; background-color: #808080; color: white;">${isUpcoming ? `<button class="play-btn" style="${playButtonStyle}" onclick="playNextNMatches(${index + 1}, '${tournamentId}')">▶</button>` : ''}${row.id ? row.id.toString().slice(-3) : 'N/A'}</td>`;
  html += `<td style="${getGroupBackground(row.stage)}">${row.grp || 'N/A'}</td>`;
  html += `<td><span style="${pillStyle(categoryColor)}">${row.category || 'N/A'}</span></td>`;
  html += `<td>${processStage(row.stage)}</td>`;
  html += `<td><span style="${pillStyle(pitchColor)}">${row.pitch || 'N/A'}</span></td>`;
  html += `<td>${row.scheduledTime || 'N/A'}</td>`;
  const { teamName: team1Name } = processTeamName(row.team1);
  const { teamName: team2Name } = processTeamName(row.team2);
  html += `<td style="${team1CellStyle}"><span style="${team1Style}">${truncateTeamName(team1Name.toUpperCase()) || 'N/A'}</span></td>`;
  if (isUpcoming) {
    html += `<td style="${team2CellStyle}"><span style="${team2Style}">${truncateTeamName(team2Name.toUpperCase()) || 'N/A'}</span></td>`;
    const { teamName: umpireTeamName } = processTeamName(row.umpireTeam);
    html += `<td style="${umpireCellStyle}"><span style="${umpireStyle}">${truncateTeamName(umpireTeamName.toUpperCase()) || 'N/A'}</span></td>`;
  } else {
    const team1Score = formatScore(row.goals1, row.points1);
    const team2Score = formatScore(row.goals2, row.points2);
    const score1Style = team1Score === 'N/A' ? 'color:grey;' : '';
    const score2Style = team2Score === 'N/A' ? 'color:grey;' : '';
    html += `<td style="${score1Style}">${team1Score}</td>`;
    html += `<td style="${team2CellStyle}"><span style="${team2Style}">${truncateTeamName(team2Name.toUpperCase()) || 'N/A'}</span></td>`;
    html += `<td style="${score2Style}">${team2Score}</td>`;
  }
  html += '</tr>';
  return html;
}

function generateTable(title, headers, matches, tournamentId, isUpcoming, totalMatches) {
  let html = `<h3 style="font-size: 1.25em; margin-top: 30px;">${title} (${matches.length}/${totalMatches})</h3>`;
  html += `<table id="${isUpcoming ? 'upcoming-table' : 'finished-table'}">`;
  html += `<tr>${headers.map(h => `<th style="background-color: transparent">${h.toUpperCase()}</th>`).join('')}</tr>`;
  
  matches.forEach((row, index) => {
    const isNext = isUpcoming && isNextMatch(row, matches);
    html += generateMatchRow(row, index, tournamentId, isUpcoming, isNext);
  });

  html += '</table>';
  if (matches.length > 10) {
    const moreCount = matches.length - 10;
    const tableId = isUpcoming ? 'upcoming' : 'finished';
    html += `<div style="margin-top: 10px; text-align: center;">`;
    html += `<a id="show-more-${tableId}" href="#" style="color: #3498db; text-decoration: underline;" onclick="document.querySelectorAll('#${tableId}-table .${tableId}-hidden-row').forEach(row => row.style.display = ''); document.getElementById('show-more-${tableId}').style.display = 'none'; document.getElementById('show-less-${tableId}').style.display = 'inline-block'; return false;">Show ${moreCount} More</a>`;
    html += `<a id="show-less-${tableId}" href="#" style="color: #3498db; text-decoration: underline; display: none;" onclick="document.querySelectorAll('#${tableId}-table .${tableId}-hidden-row').forEach(row => row.style.display = 'none'); document.getElementById('show-more-${tableId}').style.display = 'inline-block'; this.style.display = 'none'; return false;">Show Less</a>`;
    html += `</div>`;
  }
  return html;
}

module.exports = {
  isNextMatch,
  processStage,
  hashString,
  getRandomColor,
  pillStyle,
  teamPillStyle,
  truncateTeamName,
  getGroupBackground,
  rowStyleBase,
  playButtonStyle,
  generateMatchRow,
  generateTable
};
