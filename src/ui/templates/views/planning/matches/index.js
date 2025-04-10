const { processTeamName, formatScore } = require('../../../../utils');

// **Helper Functions**

// Generate consistent colors based on a string hash
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

// Styles
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

const rowStyleBase = `position: relative; transition: background-color 0.2s;`;
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

// Background and stage processing
function getGroupBackground(stage) {
    return stage === 'group' ? 'background-color: rgba(255, 235, 204, 0.8);' : 'background-color: rgba(230, 255, 230, 0.8);';
}

function processStage(stage) {
    if (stage !== 'group') {
        const parts = stage.split('_');
        if (parts.length === 2) return `<b>${parts[0]}:</b>${parts[1]}`;
    }
    return stage;
}

// **Cell Generators**
function generatePillCell(value) {
    const color = getRandomColor(value);
    return `<span style="${pillStyle(color)}">${value || 'N/A'}</span>`;
}

function generateUpcomingTeamCell(team, stage, isUmpire = false) {
    const isTBDNonGroup = team === 'TBD' && stage !== 'group';
    const color = isTBDNonGroup ? '#ff4500' : getRandomColor(team, true);
    const teamStyle = teamPillStyle(color, isUmpire, isTBDNonGroup);
    const cellStyle = isTBDNonGroup ? 'background-color: rgba(255, 69, 0, 0.2);' : '';
    return `<td style="${cellStyle}"><team-name name="${team}" maxchars="25" style="${teamStyle}"></team-name></td>`;
}

function generateFinishedTeamCell(team, direction = null) {
    const dirAttr = direction ? ` direction="${direction}"` : '';
    return `<td><team-name name="${team}" maxchars="25"${dirAttr}></team-name></td>`;
}

// **Column Renderers**
const commonColumnRenderers = {
    id: (row) => `<td style="background-color: #808080; color: white;">${row.id ? row.id.toString().slice(-3) : 'N/A'}</td>`,
    group: (row) => `<td style="${getGroupBackground(row.stage)}">${row.grp || 'N/A'}</td>`,
    category: (row) => `<td>${generatePillCell(row.category)}</td>`,
    stage: (row) => `<td>${processStage(row.stage)}</td>`,
    pitch: (row) => `<td>${generatePillCell(row.pitch)}</td>`,
    time: (row) => `<td>${ row.scheduledTime ? row.scheduledTime.substring(10).trim() : 'N/A' }</td>`,
};

const upcomingIdRenderer = (row, index, tournamentId) => {
    const playButton = `<button class="play-btn" style="${playButtonStyle}" onclick="playNextNMatches(${index + 1}, '${tournamentId}')">▶</button>`;
    return `<td style="position: relative; background-color: #808080; color: white;">${playButton}${row.id ? row.id.toString().slice(-3) : 'N/A'}</td>`;
};

const upcomingColumnRenderers = [
    upcomingIdRenderer,
    commonColumnRenderers.group,
    commonColumnRenderers.category,
    commonColumnRenderers.stage,
    commonColumnRenderers.pitch,
    commonColumnRenderers.time,
    (row) => generateUpcomingTeamCell(row.team1, row.stage),
    (row) => generateUpcomingTeamCell(row.team2, row.stage),
    (row) => generateUpcomingTeamCell(row.umpireTeam, row.stage, true),
];

const finishedColumnRenderers = [
    commonColumnRenderers.id,
    commonColumnRenderers.group,
    commonColumnRenderers.category,
    commonColumnRenderers.stage,
    commonColumnRenderers.pitch,
    (row) => `<td>${row.scheduledTime ? row.scheduledTime.substring(10) : 'N/A'}</td>`,
    (row) => generateFinishedTeamCell(row.team1, 'r2l'),
    (row) => {
        const score = formatScore(row.goals1, row.points1);
        const scoreStyle = score === 'N/A' ? 'color: grey;' : '';
        return `<td style="${scoreStyle}">${score}</td>`;
    },
    (row) => {
        const score = formatScore(row.goals2, row.points2);
        const scoreStyle = score === 'N/A' ? 'color: grey;' : '';
        return `<td style="${scoreStyle}">${score}</td>`;
    },
    (row) => generateFinishedTeamCell(row.team2),
];

// **Row Templates**
function upcomingRowTemplate(row, index, isHidden, tournamentId, isNext) {
    const rowClass = isHidden ? 'upcoming-hidden-row' : '';
    let rowStyle = isNext ? `${rowStyleBase} background-color: lightblue;` : `${rowStyleBase} background-color: ${index % 2 === 0 ? '#f1f1f1' : '#e1e1e1'};`;
    if (isHidden) rowStyle += ' display: none;';
    const cells = upcomingColumnRenderers.map(renderer => renderer(row, index, tournamentId)).join('');
    return `<tr class="${rowClass}" style="${rowStyle}" onmouseover="this.querySelector('.play-btn').style.display='block';" onmouseout="this.querySelector('.play-btn').style.display='none';">${cells}</tr>`;
}

function finishedRowTemplate(row, index, isHidden) {
    const rowClass = isHidden ? 'finished-hidden-row' : '';
    let rowStyle = `background-color: ${index % 2 === 0 ? '#f1f1f1' : '#e1e1e1'};`;
    if (isHidden) rowStyle += ' display: none;';
    const cells = finishedColumnRenderers.map(renderer => renderer(row)).join('');
    return `<tr class="${rowClass}" style="${rowStyle}">${cells}</tr>`;
}

// **Table Generator**
function generateTable(headers, rows, rowTemplate, tableId, hiddenClass, tournamentId, isUpcoming = false) {
    let html = `<table id="${tableId}">`;
    html += `<tr>${headers.map(h => `<th style="background-color: transparent">${h.toUpperCase()}</th>`).join('')}</tr>`;
    rows.forEach((row, index) => {
        const isHidden = index >= 10;
        const isNext = isUpcoming && index === 0;
        html += rowTemplate(row, index, isHidden, tournamentId, isNext);
    });
    html += '</table>';
    if (rows.length > 10) {
        const moreCount = rows.length - 10;
        html += `<div style="margin-top: 10px; text-align: center;">`;
        html += `<a id="show-more-${tableId}" href="#" style="color: #3498db; text-decoration: underline;" onclick="document.querySelectorAll('#${tableId} .${hiddenClass}').forEach(row => row.style.display = ''); document.getElementById('show-more-${tableId}').style.display = 'none'; document.getElementById('show-less-${tableId}').style.display = 'inline-block'; return false;">Show ${moreCount} More</a>`;
        html += `<a id="show-less-${tableId}" href="#" style="color: #3498db; text-decoration: underline; display: none;" onclick="document.querySelectorAll('#${tableId} .${hiddenClass}').forEach(row => row.style.display = 'none'); document.getElementById('show-more-${tableId}').style.display = 'inline-block'; this.style.display = 'none'; return false;">Show Less</a>`;
        html += `</div>`;
    }
    return html;
}

// **Main Function**
module.exports = function generateMatchesPlanning(data) {
    // Split and sort matches
    const upcomingMatches = data.matches
        .filter(match => match.started === 'false')
        .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime) || a.id - b.id);
    const finishedMatches = data.matches
        .filter(match => match.started === 'true')
        .sort((a, b) => b.scheduledTime.localeCompare(a.scheduledTime) || b.id - a.id);
    const totalMatches = data.matches.length;

    // Define headers
    const upcomingHeaders = ['ID', 'Group', 'Category', 'Stage', 'Pitch', 'Time', 'Team 1', 'Team 2', 'Umpire'];
    const finishedHeaders = ['ID', 'Group', 'Category', 'Stage', 'Pitch', 'Time', 'Team 1', 'Score', 'Score', 'Team 2'];

    // Generate tables
    const upcomingTable = generateTable(upcomingHeaders, upcomingMatches, upcomingRowTemplate, 'upcoming-table', 'upcoming-hidden-row', data.tournamentId, true);
    const finishedTable = generateTable(finishedHeaders, finishedMatches, finishedRowTemplate, 'finished-table', 'finished-hidden-row', data.tournamentId, false);

    // Build HTML
    let html = '<div id="planning-matches">';
    html += '<h2>Simulate running tournament</h2>';
    html += '<p>Simulate tournament scenarios by playing upcoming matches or import fixtures from a CSV.</p>';
    html += '<div style="margin-bottom: 20px; overflow: hidden;">';
    html += `<button style="background-color: #e74c3c; color: white;" hx-get="/planning/${data.tournamentId}/reset" hx-target="#planning-matches" hx-swap="outerHTML" hx-trigger="click" hx-on::after-request="htmx.ajax('GET', '/planning/${data.tournamentId}', '#planning-matches')">Reset Tournament</button> `;
    html += `<button hx-post="/planning/${data.tournamentId}/simulate/1" hx-target="#planning-matches" hx-swap="outerHTML">Play Next Match</button> `;
    html += `<input type="number" id="play-n-matches-input" min="1" style="width: 80px; margin-left: 10px; padding: 8px;" placeholder="N"> `;
    html += `<button onclick="playNextNMatches(document.getElementById('play-n-matches-input').value, '${data.tournamentId}')" style="margin-left: 5px;">Play Next N Matches</button>`;
    html += `<button hx-get="/planning/${data.tournamentId}/import-fixtures" hx-target="body" hx-swap="outerHTML" style="background-color: #e67e22; color: white; margin-left: 10px; float: right;">Import Fixtures</button>`;
    html += '</div>';

    html += `<h3 style="font-size: 1.25em; margin-top: 30px;">UPCOMING GAMES (${upcomingMatches.length}/${totalMatches})</h3>`;
    html += upcomingTable;

    html += `<h3 style="font-size: 1.25em; margin-top: 30px;">FINISHED GAMES (${finishedMatches.length}/${totalMatches})</h3>`;
    html += finishedTable;

    html += '</div>';

    // Add script
    html += `
        <script>
            async function playNextNMatches(n, tournamentId) {
                for (let i = 0; i < n; i++) {
                    await htmx.ajax('POST', '/planning/' + tournamentId + '/simulate/1', {
                        target: '#planning-matches',
                        swap: 'outerHTML'
                    });
                }
            }
        </script>
    `;

    return html;
};

