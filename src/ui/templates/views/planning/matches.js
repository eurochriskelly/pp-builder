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

// Style for team names with transparent white pill background
const teamPillStyle = (color) => `
    color: ${color};
    background-color: rgba(255, 255, 255, 0.5);
    padding: 2px 6px;
    border-radius: 10px;
    display: inline-block;
    font-weight: bold;
    text-transform: uppercase;
`;

// Function to determine group column background color
function getGroupBackground(stage) {
    return stage === 'group' ? 'background-color: #ffebcc;' : 'background-color: #e6ffe6;'; // Light orange for group, light green for others
}

module.exports = function generateMatchesPlanning(data) {
    let html = '<div id="planning-matches">';
    html += '<h2>Simulate running tournament</h2>';
    html += '<p>Simulate tournament scenarios by playing upcoming matches or import fixtures from a CSV.</p>';

    html += '<div style="margin-bottom: 20px; overflow: hidden;">';
    html += '<button style="background-color: #e74c3c; color: white;" hx-get="/planning/' + data.tournamentId + '/reset" hx-target="#planning-matches" hx-swap="outerHTML" hx-trigger="click" hx-on::after-request="htmx.ajax(\'GET\', \'/planning/' + data.tournamentId + '\', \'#planning-matches\')">Reset Tournament</button> ';
    html += '<button hx-post="/planning/' + data.tournamentId + '/simulate/1" hx-target="#planning-matches" hx-swap="outerHTML">Play Next Match</button> ';
    html += '<button hx-post="/planning/' + data.tournamentId + '/simulate/5" hx-target="#planning-matches" hx-swap="outerHTML">Play Next 5 Matches</button> ';
    html += '<button hx-post="/planning/' + data.tournamentId + '/simulate/10" hx-target="#planning-matches" hx-swap="outerHTML">Play Next 10 Matches</button> ';
    html += '<button hx-get="/planning/' + data.tournamentId + '/import-fixtures" hx-target="body" hx-swap="outerHTML" style="background-color: #e67e22; color: white; margin-left: 10px; float: right;">Import Fixtures</button>';
    html += '</div>';

    // Split matches into upcoming and finished
    const upcomingMatches = data.matches
        .filter(match => match.started === 'false')
        .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
    const finishedMatches = data.matches
        .filter(match => match.started === 'true')
        .sort((a, b) => b.scheduledTime.localeCompare(a.scheduledTime)); // Reverse order
    const totalMatches = data.matches.length;

    // Upcoming Games table (limited to 10 with More/Less buttons)
    html += `<h3>Upcoming Games (${upcomingMatches.length}/${totalMatches})</h3>`;
    html += '<table id="upcoming-table">';
    const upcomingHeaders = ['ID', 'Group', 'Category', 'Stage', 'Pitch', 'Time', 'Team 1', 'Team 2', 'Umpire'];
    html += `<tr>${upcomingHeaders.map(h => h === 'ID' ? `<th class="id-column">${h}</th>` : `<th>${h}</th>`).join('')}</tr>`;
    upcomingMatches.slice(0, 10).forEach((row) => {
        const isNext = isNextMatch(row, upcomingMatches);
        const rowStyle = isNext ? 'background-color: lightblue;' : '';
        const categoryColor = getRandomColor(row.category);
        const pitchColor = getRandomColor(row.pitch);
        const team1Color = getRandomColor(row.team1, true);
        const team2Color = getRandomColor(row.team2, true);
        const umpireColor = getRandomColor(row.umpireTeam, true);
        html += `<tr style="${rowStyle}">`;
        html += `<td class="id-column">${row.id ? row.id.toString().slice(-3) : 'N/A'}</td>`;
        html += `<td style="${getGroupBackground(row.stage)}">${row.grp || 'N/A'}</td>`;
        html += `<td><span style="${pillStyle(categoryColor)}">${row.category || 'N/A'}</span></td>`;
        html += `<td>${processStage(row.stage)}</td>`;
        html += `<td><span style="${pillStyle(pitchColor)}">${row.pitch || 'N/A'}</span></td>`;
        html += `<td>${row.scheduledTime || 'N/A'}</td>`;
        const { teamName: team1Name } = processTeamName(row.team1);
        const { teamName: team2Name } = processTeamName(row.team2);
        const { teamName: umpireTeamName } = processTeamName(row.umpireTeam);
        html += `<td><span style="${teamPillStyle(team1Color)}">${team1Name.toUpperCase() || 'N/A'}</span></td>`;
        html += `<td><span style="${teamPillStyle(team2Color)}">${team2Name.toUpperCase() || 'N/A'}</span></td>`;
        html += `<td><span style="${teamPillStyle(umpireColor)}">${umpireTeamName.toUpperCase() || 'N/A'}</span></td>`;
        html += '</tr>';
    });
    if (upcomingMatches.length > 10) {
        upcomingMatches.slice(10).forEach((row) => {
            const isNext = isNextMatch(row, upcomingMatches);
            const rowStyle = isNext ? 'background-color: lightblue; display: none;' : 'display: none;';
            const categoryColor = getRandomColor(row.category);
            const pitchColor = getRandomColor(row.pitch);
            const team1Color = getRandomColor(row.team1, true);
            const team2Color = getRandomColor(row.team2, true);
            const umpireColor = getRandomColor(row.umpireTeam, true);
            html += `<tr style="${rowStyle}" class="upcoming-hidden-row">`;
            html += `<td class="id-column">${row.id ? row.id.toString().slice(-3) : 'N/A'}</td>`;
            html += `<td style="${getGroupBackground(row.stage)}">${row.grp || 'N/A'}</td>`;
            html += `<td><span style="${pillStyle(categoryColor)}">${row.category || 'N/A'}</span></td>`;
            html += `<td>${processStage(row.stage)}</td>`;
            html += `<td><span style="${pillStyle(pitchColor)}">${row.pitch || 'N/A'}</span></td>`;
            html += `<td>${row.scheduledTime || 'N/A'}</td>`;
            const { teamName: team1Name } = processTeamName(row.team1);
            const { teamName: team2Name } = processTeamName(row.team2);
            const { teamName: umpireTeamName } = processTeamName(row.umpireTeam);
            html += `<td><span style="${teamPillStyle(team1Color)}">${team1Name.toUpperCase() || 'N/A'}</span></td>`;
            html += `<td><span style="${teamPillStyle(team2Color)}">${team2Name.toUpperCase() || 'N/A'}</span></td>`;
            html += `<td><span style="${teamPillStyle(umpireColor)}">${umpireTeamName.toUpperCase() || 'N/A'}</span></td>`;
            html += '</tr>';
        });
        html += '</table>';
        const moreCount = upcomingMatches.length - 10;
        html += `<div style="margin-top: 10px;">`;
        html += `<button id="show-more-upcoming" style="background-color: #3498db; color: white;" onclick="document.querySelectorAll('#upcoming-table .upcoming-hidden-row').forEach(row => row.style.display = ''); document.getElementById('show-more-upcoming').style.display = 'none'; document.getElementById('show-less-upcoming').style.display = 'inline-block';">Show ${moreCount} More</button>`;
        html += `<button id="show-less-upcoming" style="background-color: #3498db; color: white; display: none;" onclick="document.querySelectorAll('#upcoming-table .upcoming-hidden-row').forEach(row => row.style.display = 'none'); document.getElementById('show-more-upcoming').style.display = 'inline-block'; this.style.display = 'none';">Show Less</button>`;
        html += `</div>`;
    } else {
        html += '</table>';
    }

    // Finished Games table (reversed order, limited to 10 with More/Less buttons)
    html += `<h3>Finished Games (${finishedMatches.length}/${totalMatches})</h3>`;
    html += '<table id="finished-table" style="margin-top: 20px;">';
    const finishedHeaders = ['ID', 'Group', 'Category', 'Stage', 'Pitch', 'Time', 'Team 1', 'Score', 'Team 2', 'Score'];
    html += `<tr>${finishedHeaders.map(h => h === 'ID' ? `<th class="id-column">${h}</th>` : `<th>${h}</th>`).join('')}</tr>`;
    finishedMatches.slice(0, 10).forEach(row => {
        const categoryColor = getRandomColor(row.category);
        const pitchColor = getRandomColor(row.pitch);
        const team1Color = getRandomColor(row.team1, true);
        const team2Color = getRandomColor(row.team2, true);
        html += '<tr>';
        html += `<td class="id-column">${row.id ? row.id.toString().slice(-3) : 'N/A'}</td>`;
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
        html += `<td><span style="${teamPillStyle(team1Color)}">${team1Name.toUpperCase() || 'N/A'}</span></td>`;
        html += `<td style="${score1Style}">${team1Score}</td>`;
        html += `<td><span style="${teamPillStyle(team2Color)}">${team2Name.toUpperCase() || 'N/A'}</span></td>`;
        html += `<td style="${score2Style}">${team2Score}</td>`;
        html += '</tr>';
    });
    if (finishedMatches.length > 10) {
        finishedMatches.slice(10).forEach(row => {
            const categoryColor = getRandomColor(row.category);
            const pitchColor = getRandomColor(row.pitch);
            const team1Color = getRandomColor(row.team1, true);
            const team2Color = getRandomColor(row.team2, true);
            html += '<tr style="display: none;" class="finished-hidden-row">';
            html += `<td class="id-column">${row.id ? row.id.toString().slice(-3) : 'N/A'}</td>`;
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
            html += `<td><span style="${teamPillStyle(team1Color)}">${team1Name.toUpperCase() || 'N/A'}</span></td>`;
            html += `<td style="${score1Style}">${team1Score}</td>`;
            html += `<td><span style="${teamPillStyle(team2Color)}">${team2Name.toUpperCase() || 'N/A'}</span></td>`;
            html += `<td style="${score2Style}">${team2Score}</td>`;
            html += '</tr>';
        });
        html += '</table>';
        const moreCount = finishedMatches.length - 10;
        html += `<div style="margin-top: 10px;">`;
        html += `<button id="show-more-finished" style="background-color: #3498db; color: white;" onclick="document.querySelectorAll('#finished-table .finished-hidden-row').forEach(row => row.style.display = ''); document.getElementById('show-more-finished').style.display = 'none'; document.getElementById('show-less-finished').style.display = 'inline-block';">Show ${moreCount} More</button>`;
        html += `<button id="show-less-finished" style="background-color: #3498db; color: white; display: none;" onclick="document.querySelectorAll('#finished-table .finished-hidden-row').forEach(row => row.style.display = 'none'); document.getElementById('show-more-finished').style.display = 'inline-block'; this.style.display = 'none';">Show Less</button>`;
        html += `</div>`;
    } else {
        html += '</table>';
    }

    html += '</div>';
    return html;
};
