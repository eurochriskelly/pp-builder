const { processTeamName, formatScore } = require('../../../utils');

// Function to determine if a match is the next to be played
function isNextMatch(match, upcomingMatches) {
    return match.id === upcomingMatches[0].id;
}

// Function to process stage display
function processStage(stage) {
    if (stage !== 'group') {
        const parts = stage.split('_');
        if (parts.length === 2) {
            return `<b>${parts[0]}:</b>${parts[1]}`;
        }
    }
    return stage;
}

// Improved hash function for better distribution
function hashString(str) {
    let hash = 17; // Start with a prime number seed
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 23 + str.charCodeAt(i)) & 0xFFFFFFFF; // Use 23 for better spread
    }
    return hash;
}

// Function to generate a consistent pastel color for categories/pitches or dark color for teams
function getRandomColor(name, isTeam = false) {
    const hash = hashString(name || 'unknown');
    const hue = hash % 360; // Keep hue in 0-359 range
    return isTeam ? `hsl(${hue}, 50%, 30%)` : `hsl(${hue}, 40%, 75%)`; // Dark for teams, pastel for others
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

// Function to determine group column background color with 30% transparency
function getGroupBackground(stage) {
    return stage === 'group' ? 'background-color: rgba(255, 235, 204, 0.8);' : 'background-color: rgba(230, 255, 230, 0.8);';
}

// Inline CSS for row and play button
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

module.exports = function generateMatchesPlanning(data) {
    let html = '<div id="planning-matches">';
    html += '<h2>Simulate running tournament</h2>';
    html += '<p>Simulate tournament scenarios by playing upcoming matches or import fixtures from a CSV.</p>';

    html += '<div style="margin-bottom: 20px; overflow: hidden;">';
    html += '<button style="background-color: #e74c3c; color: white;" hx-get="/planning/' + data.tournamentId + '/reset" hx-target="#planning-matches" hx-swap="outerHTML" hx-trigger="click" hx-on::after-request="htmx.ajax(\'GET\', \'/planning/' + data.tournamentId + '\', \'#planning-matches\')">Reset Tournament</button> ';
    html += '<button hx-post="/planning/' + data.tournamentId + '/simulate/1" hx-target="#planning-matches" hx-swap="outerHTML">Play Next Match</button> ';
    html += `<input type="number" id="play-n-matches-input" min="1" style="width: 80px; margin-left: 10px; padding: 8px;" placeholder="N"> `;
    html += `<button onclick="playNextNMatches(document.getElementById('play-n-matches-input').value, '${data.tournamentId}')" style="margin-left: 5px;">Play Next N Matches</button>`;
    html += '<button hx-get="/planning/' + data.tournamentId + '/import-fixtures" hx-target="body" hx-swap="outerHTML" style="background-color: #e67e22; color: white; margin-left: 10px; float: right;">Import Fixtures</button>';
    html += '</div>';

    // Split matches into upcoming and finished with deterministic sorting
    const upcomingMatches = data.matches
        .filter(match => match.started === 'false')
        .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime) || a.id - b.id);
    const finishedMatches = data.matches
        .filter(match => match.started === 'true')
        .sort((a, b) => b.scheduledTime.localeCompare(a.scheduledTime) || b.id - a.id);
    const totalMatches = data.matches.length;

    // Upcoming Games table
    html += `<h3 style="font-size: 1.25em; margin-top: 30px;">UPCOMING GAMES (${upcomingMatches.length}/${totalMatches})</h3>`;
    html += '<table id="upcoming-table">';
    const upcomingHeaders = ['ID', 'Group', 'Category', 'Stage', 'Pitch', 'Time', 'Team 1', 'Team 2', 'Umpire'];
    html += `<tr>${upcomingHeaders.map(h => `<th style="background-color: transparent">${h.toUpperCase()}</th>`).join('')}</tr>`;
    upcomingMatches.slice(0, 10).forEach((row, index) => {
        const isNext = isNextMatch(row, upcomingMatches);
        const rowStyle = isNext ? `${rowStyleBase} background-color: lightblue;` : `${rowStyleBase} background-color: ${index % 2 === 0 ? '#f1f1f1' : '#e1e1e1'};`;
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
        html += `<tr style="${rowStyle}" onmouseover="this.querySelector('.play-btn').style.display='block';" onmouseout="this.querySelector('.play-btn').style.display='none';">`;
        html += `<td style="position: relative; background-color: #808080; color: white;"><button class="play-btn" style="${playButtonStyle}" onclick="playNextNMatches(${index + 1}, '${data.tournamentId}')">▶</button>${row.id ? row.id.toString().slice(-3) : 'N/A'}</td>`;
        html += `<td style="${getGroupBackground(row.stage)}">${row.grp || 'N/A'}</td>`;
        html += `<td><span style="${pillStyle(categoryColor)}">${row.category || 'N/A'}</span></td>`;
        html += `<td>${processStage(row.stage)}</td>`;
        html += `<td><span style="${pillStyle(pitchColor)}">${row.pitch || 'N/A'}</span></td>`;
        html += `<td>${row.scheduledTime || 'N/A'}</td>`;
        const { teamName: team1Name } = processTeamName(row.team1);
        const { teamName: team2Name } = processTeamName(row.team2);
        const { teamName: umpireTeamName } = processTeamName(row.umpireTeam);
        html += `<td style="${team1CellStyle}"><span style="${team1Style}">${truncateTeamName(team1Name.toUpperCase()) || 'N/A'}</span></td>`;
        html += `<td style="${team2CellStyle}"><span style="${team2Style}">${truncateTeamName(team2Name.toUpperCase()) || 'N/A'}</span></td>`;
        html += `<td style="${umpireCellStyle}"><span style="${umpireStyle}">${truncateTeamName(umpireTeamName.toUpperCase()) || 'N/A'}</span></td>`;
        html += '</tr>';
    });
    if (upcomingMatches.length > 10) {
        upcomingMatches.slice(10).forEach((row, index) => {
            const isNext = isNextMatch(row, upcomingMatches);
            const rowStyle = isNext ? `${rowStyleBase} background-color: lightblue; display: none;` : `${rowStyleBase} background-color: ${(index + 10) % 2 === 0 ? '#f1f1f1' : '#e1e1e1'}; display: none;`;
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
            html += `<tr style="${rowStyle}" class="upcoming-hidden-row" onmouseover="this.querySelector('.play-btn').style.display='block';" onmouseout="this.querySelector('.play-btn').style.display='none';">`;
            html += `<td style="position: relative; background-color: #808080; color: white;"><button class="play-btn" style="${playButtonStyle}" onclick="playNextNMatches(${index + 11}, '${data.tournamentId}')">▶</button>${row.id ? row.id.toString().slice(-3) : 'N/A'}</td>`;
            html += `<td style="${getGroupBackground(row.stage)}">${row.grp || 'N/A'}</td>`;
            html += `<td><span style="${pillStyle(categoryColor)}">${row.category || 'N/A'}</span></td>`;
            html += `<td>${processStage(row.stage)}</td>`;
            html += `<td><span style="${pillStyle(pitchColor)}">${row.pitch || 'N/A'}</span></td>`;
            html += `<td>${row.scheduledTime || 'N/A'}</td>`;
            const { teamName: team1Name } = processTeamName(row.team1);
            const { teamName: team2Name } = processTeamName(row.team2);
            const { teamName: umpireTeamName } = processTeamName(row.umpireTeam);
            html += `<td style="${team1CellStyle}"><span style="${team1Style}">${truncateTeamName(team1Name.toUpperCase()) || 'N/A'}</span></td>`;
            html += `<td style="${team2CellStyle}"><span style="${team2Style}">${truncateTeamName(team2Name.toUpperCase()) || 'N/A'}</span></td>`;
            html += `<td style="${umpireCellStyle}"><span style="${umpireStyle}">${truncateTeamName(umpireTeamName.toUpperCase()) || 'N/A'}</span></td>`;
            html += '</tr>';
        });
        html += '</table>';
        const moreCount = upcomingMatches.length - 10;
        html += `<div style="margin-top: 10px; text-align: center;">`;
        html += `<a id="show-more-upcoming" href="#" style="color: #3498db; text-decoration: underline;" onclick="document.querySelectorAll('#upcoming-table .upcoming-hidden-row').forEach(row => row.style.display = ''); document.getElementById('show-more-upcoming').style.display = 'none'; document.getElementById('show-less-upcoming').style.display = 'inline-block'; return false;">Show ${moreCount} More</a>`;
        html += `<a id="show-less-upcoming" href="#" style="color: #3498db; text-decoration: underline; display: none;" onclick="document.querySelectorAll('#upcoming-table .upcoming-hidden-row').forEach(row => row.style.display = 'none'); document.getElementById('show-more-upcoming').style.display = 'inline-block'; this.style.display = 'none'; return false;">Show Less</a>`;
        html += `</div>`;
    } else {
        html += '</table>';
    }

    // Finished Games table
    html += `<h3 style="font-size: 1.25em; margin-top: 30px;">FINISHED GAMES (${finishedMatches.length}/${totalMatches})</h3>`;
    html += '<table id="finished-table" style="margin-top: 20px;">';
    const finishedHeaders = ['ID', 'Group', 'Category', 'Stage', 'Pitch', 'Time', 'Team 1', 'Score', 'Team 2', 'Score'];
    html += `<tr>${finishedHeaders.map(h => `<th style="background-color: transparent">${h.toUpperCase()}</th>`).join('')}</tr>`;
    finishedMatches.slice(0, 10).forEach((row, index) => {
        const rowStyle = `background-color: ${index % 2 === 0 ? '#f1f1f1' : '#e1e1e1'};`;
        const categoryColor = getRandomColor(row.category);
        const pitchColor = getRandomColor(row.pitch);
        const team1Color = getRandomColor(row.team1, true);
        const team2Color = getRandomColor(row.team2, true);
        html += `<tr style="${rowStyle}">`;
        html += `<td style="background-color: #808080; color: white;">${row.id ? row.id.toString().slice(-3) : 'N/A'}</td>`;
        html += `<td style="${getGroupBackground(row.stage)}">${row.grp || 'N/A'}</td>`;
        html += `<td><span style="${pillStyle(categoryColor)}">${row.category || 'N/A'}</span></td>`;
        html += `<td>${processStage(row.stage)}</td>`;
        html += `<td><span style="${pillStyle(pitchColor)}">${row.pitch || 'N/A'}</span></td>`;
        html += `<td>${row.scheduledTime || 'N/A'}</td>`;
        const { teamName: team1Name } = processTeamName(row.team1);
        const { teamName: team2Name } = processTeamName(row.team2);
        const team1Score = formatScore(row.goals1, row.points1);
        const team2Score = formatScore(row.goals2, row.points2);
        const score1Style = team1Score === 'N/A' ? 'color:grey;' : '';
        const score2Style = team2Score === 'N/A' ? 'color:grey;' : '';
        html += `<td><span style="${teamPillStyle(team1Color)}">${truncateTeamName(team1Name.toUpperCase()) || 'N/A'}</span></td>`;
        html += `<td style="${score1Style}">${team1Score}</td>`;
        html += `<td><span style="${teamPillStyle(team2Color)}">${truncateTeamName(team2Name.toUpperCase()) || 'N/A'}</span></td>`;
        html += `<td style="${score2Style}">${team2Score}</td>`;
        html += '</tr>';
    });
    if (finishedMatches.length > 10) {
        finishedMatches.slice(10).forEach((row, index) => {
            const rowStyle = `background-color: ${(index + 10) % 2 === 0 ? '#f1f1f1' : '#e1e1e1'}; display: none;`;
            const categoryColor = getRandomColor(row.category);
            const pitchColor = getRandomColor(row.pitch);
            const team1Color = getRandomColor(row.team1, true);
            const team2Color = getRandomColor(row.team2, true);
            html += `<tr style="${rowStyle}" class="finished-hidden-row">`;
            html += `<td style="background-color: #808080; color: white;">${row.id ? row.id.toString().slice(-3) : 'N/A'}</td>`;
            html += `<td style="${getGroupBackground(row.stage)}">${row.grp || 'N/A'}</td>`;
            html += `<td><span style="${pillStyle(categoryColor)}">${row.category || 'N/A'}</span></td>`;
            html += `<td>${processStage(row.stage)}</td>`;
            html += `<td><span style="${pillStyle(pitchColor)}">${row.pitch || 'N/A'}</span></td>`;
            html += `<td>${row.scheduledTime || 'N/A'}</td>`;
            const { teamName: team1Name } = processTeamName(row.team1);
            const { teamName: team2Name } = processTeamName(row.team2);
            const team1Score = formatScore(row.goals1, row.points1);
            const team2Score = formatScore(row.goals2, row.points2);
            const score1Style = team1Score === 'N/A' ? 'color:grey;' : '';
            const score2Style = team2Score === 'N/A' ? 'color:grey;' : '';
            html += `<td><span style="${teamPillStyle(team1Color)}">${truncateTeamName(team1Name.toUpperCase()) || 'N/A'}</span></td>`;
            html += `<td style="${score1Style}">${team1Score}</td>`;
            html += `<td><span style="${teamPillStyle(team2Color)}">${truncateTeamName(team2Name.toUpperCase()) || 'N/A'}</span></td>`;
            html += `<td style="${score2Style}">${team2Score}</td>`;
            html += '</tr>';
        });
        html += '</table>';
        const moreCount = finishedMatches.length - 10;
        html += `<div style="margin-top: 10px; text-align: center;">`;
        html += `<a id="show-more-finished" href="#" style="color: #3498db; text-decoration: underline;" onclick="document.querySelectorAll('#finished-table .finished-hidden-row').forEach(row => row.style.display = ''); document.getElementById('show-more-finished').style.display = 'none'; document.getElementById('show-less-finished').style.display = 'inline-block'; return false;">Show ${moreCount} More</a>`;
        html += `<a id="show-less-finished" href="#" style="color: #3498db; text-decoration: underline; display: none;" onclick="document.querySelectorAll('#finished-table .finished-hidden-row').forEach(row => row.style.display = 'none'); document.getElementById('show-more-finished').style.display = 'inline-block'; this.style.display = 'none'; return false;">Show Less</a>`;
        html += `</div>`;
    } else {
        html += '</table>';
    }

    html += '</div>';

    // Inline JavaScript for play functions
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
