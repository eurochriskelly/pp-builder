const { formatScore, processTeamName } = require('../../../../../utils');
const { getRandomColor, hashString } = require('../../../../partials/styleUtils');
const { groupBy } = require('../../../../partials/groupUtils.js');

function isNextMatch(match, upcomingMatches) {
  return upcomingMatches.length > 0 && match.id === upcomingMatches[0].id;
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

function generateMatchRow(row, index, tournamentId, isUpcoming, isNext = false) {
  const rowClasses = `relative transition-colors ${isNext ? 'bg-blue-100' : index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'} ${index >= 10 ? 'hidden' : ''}`;
  const categoryColor = getRandomColor(row.category);
  const pitchColor = getRandomColor(row.pitch);
  const team1Color = row.team1 === 'TBD' && row.stage !== 'group' ? 'team-tbd' : getRandomColor(row.team1, true);
  const team2Color = row.team2 === 'TBD' && row.stage !== 'group' ? 'team-tbd' : getRandomColor(row.team2, true);
  const umpireColor = row.umpireTeam === 'TBD' && row.stage !== 'group' ? 'team-tbd' : getRandomColor(row.umpireTeam, true);
  const team1CellClass = row.team1 === 'TBD' && row.stage !== 'group' ? 'bg-orange-100' : '';
  const team2CellClass = row.team2 === 'TBD' && row.stage !== 'group' ? 'bg-orange-100' : '';
  const umpireCellClass = row.umpireTeam === 'TBD' && row.stage !== 'group' ? 'bg-orange-100' : '';

  let html = `<tr class="${rowClasses} ${isUpcoming ? 'upcoming-hidden-row' : 'finished-hidden-row'}" ${isUpcoming ? 'onmouseover="this.querySelector(\'.play-btn\').classList.remove(\'hidden\');" onmouseout="this.querySelector(\'.play-btn\').classList.add(\'hidden\');"' : ''}>`;
  // Highlight next match cell with red background
  html += `<td class="relative ${isNext ? 'bg-red-500 animate-pulse' : 'bg-gray-500'} text-white font-bold">${isUpcoming ? `<button class="play-btn hidden absolute left-1 top-1/2 -translate-y-1/2 bg-green-600 text-white rounded-full w-8 h-8 text-lg cursor-pointer" onclick="playNextNMatches(${index + 1}, '${tournamentId}')">▶</button>` : ''}${row.id ? row.id.toString().slice(-3) : 'N/A'}</td>`;
  html += `<td class="${row.stage === 'group' ? 'bg-orange-100' : 'bg-green-100'}">${row.grp || 'N/A'}</td>`;
  html += `<td><span class="text-white px-2.5 py-0.5 rounded-full text-sm font-bold uppercase inline-block max-w-full whitespace-nowrap overflow-hidden text-ellipsis ${categoryColor}">${row.category || 'N/A'}</span></td>`;
  html += `<td>${processStage(row.stage)}</td>`;
  html += `<td><span class="text-white px-2.5 py-0.5 rounded-full text-sm font-bold uppercase inline-block max-w-full whitespace-nowrap overflow-hidden text-ellipsis ${pitchColor}">${row.pitch || 'N/A'}</span></td>`;
  html += `<td>${row.scheduledTime || 'N/A'}</td>`;
  const { teamName: team1Name } = processTeamName(row.team1);
  const { teamName: team2Name } = processTeamName(row.team2);
  // team1 and team2 are always pills, umpireTeam is not
  html += `<td class="${team1CellClass}"><span class="bg-white bg-opacity-50 px-2.5 py-0.5 rounded-lg font-bold uppercase whitespace-nowrap ${team1Color}">${truncateTeamName(team1Name.toUpperCase()) || 'N/A'}</span></td>`;
  if (isUpcoming) {
    html += `<td class="${team2CellClass}"><span class="bg-white bg-opacity-50 px-2.5 py-0.5 rounded-lg font-bold uppercase whitespace-nowrap ${team2Color}">${truncateTeamName(team2Name.toUpperCase()) || 'N/A'}</span></td>`;
    html += `<td class="${umpireCellClass}"><logo-box size="30px" title="${row.umpireTeam}"></logo-box></td>`;
  } else {
    const team1Score = formatScore(row.goals1, row.points1);
    const team2Score = formatScore(row.goals2, row.points2);
    html += `<td class="${team1Score === 'N/A' ? 'text-gray-500' : ''}">${team1Score}</td>`;
    html += `<td class="${team2CellClass}"><span class="bg-white bg-opacity-50 px-2.5 py-0.5 rounded-lg font-bold uppercase whitespace-nowrap ${team2Color}">${truncateTeamName(team2Name.toUpperCase()) || 'N/A'}</span></td>`;
    html += `<td class="${team2Score === 'N/A' ? 'text-gray-500' : ''}">${team2Score}</td>`;
  }
  html += '</tr>';
  return html;
}

function generateTable(title, headers, matches, tournamentId, isUpcoming, totalMatches) {
  let html = `<h3 class="text-xl font-semibold mt-8">${title} (${matches.length}/${totalMatches})</h3>`;
  html += `<table id="${isUpcoming ? 'upcoming-table' : 'finished-table'}" class="mt-2 w-full border-collapse">`;
  html += `<tr>${headers.map(h => `<th class="p-2 text-left">${h.toUpperCase()}</th>`).join('')}</tr>`;
  
  matches.forEach((row, index) => {
    const isNext = isUpcoming && isNextMatch(row, matches);
    html += generateMatchRow(row, index, tournamentId, isUpcoming, isNext);
  });

  html += '</table>';
  if (matches.length > 10) {
    const moreCount = matches.length - 10;
    const tableId = isUpcoming ? 'upcoming' : 'finished';
    html += `<div class="mt-2 text-center">`;
    html += `<a id="show-more-${tableId}" href="#" class="text-blue-600 underline" onclick="document.querySelectorAll('#${tableId}-table .${tableId}-hidden-row').forEach(row => row.classList.remove('hidden')); document.getElementById('show-more-${tableId}').classList.add('hidden'); document.getElementById('show-less-${tableId}').classList.remove('hidden'); return false;">Show ${moreCount} More</a>`;
    html += `<a id="show-less-${tableId}" href="#" class="text-blue-600 underline hidden" onclick="document.querySelectorAll('#${tableId}-table .${tableId}-hidden-row').forEach(row => row.classList.add('hidden')); document.getElementById('show-more-${tableId}').classList.remove('hidden'); this.classList.add('hidden'); return false;">Show Less</a>`;
    html += `</div>`;
  }
  return html;
}

function truncateTeamName(name) {
  return name.length > 25 ? `${name.substring(0, 22)}...` : name;
}

module.exports = {
  isNextMatch,
  processStage,
  generateMatchRow,
  generateTable
};
