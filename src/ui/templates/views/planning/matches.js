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

// Function to generate a consistent pastel color based on a string (category or pitch)
function getRandomColor(name) {
    const hash = hashString(name || 'unknown');
    const hue = hash % 360; // Keep hue in 0-359 range
    return `hsl(${hue}, 40%, 75%)`; // Slightly darker pastel with 75% lightness
}

// Style for pill-like display with darker bg and overflow prevention
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

module.exports = function generateMatchesPlanning(data) {
    let html = '<div id="planning-matches">';
    html += '<h2>Simulate running tournament</h2>';
    html += '<p>Simulate tournament scenarios by playing upcoming matches or import fixtures from a CSV.</p>';

    html += '<div style="margin-bottom: 20px;">';
    html += '<button style="background-color: #e74c3c;" hx-get="/planning/' + data.tournamentId + '/reset" hx-target="#planning-matches" hx-swap="outerHTML" hx-trigger="click" hx-on::after-request="htmx.ajax(\'GET\', \'/planning/' + data.tournamentId + '\', \'#planning-matches\')">Reset Tournament</button> ';
    html += '<button hx-post="/planning/' + data.tournamentId + '/simulate/1" hx-target="#planning-matches" hx-swap="outerHTML">Play Next Match</button> ';
    html += '<button hx-post="/planning/' + data.tournamentId + '/simulate/5" hx-target="#planning-matches" hx-swap="outerHTML">Play Next 5 Matches</button> ';
    html += '<button hx-post="/planning/' + data.tournamentId + '/simulate/10" hx-target="#planning-matches" hx-swap="outerHTML">Play Next 10 Matches</button> ';
    html += '<button hx-get="/planning/' + data.tournamentId + '/import-fixtures" hx-target="body" hx-swap="outerHTML" style="background-color: #e67e22; color: white; margin-left: 10px;">Import Fixtures</button>';
    html += '</div>';

    // Split matches into upcoming and finished
    const upcomingMatches = data.matches
        .filter(match => match.started === 'false')
        .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
    const finishedMatches = data.matches.filter(match => match.started === 'true');
    const totalMatches = data.matches.length;

    // Upcoming Games table
    html += `<h3>Upcoming Games (${upcomingMatches.length}/${totalMatches})</h3>`;
    html += '<table>';
    const upcomingHeaders = ['ID', 'Category', 'Group', 'Stage', 'Pitch', 'Time', 'Team 1', 'Team 2', 'Umpire'];
    html += `<tr>${upcomingHeaders.map(h => h === 'ID' ? `<th class="id-column">${h}</th>` : `<th>${h}</th>`).join('')}</tr>`;
    upcomingMatches.forEach((row) => {
        const isNext = isNextMatch(row, upcomingMatches);
        const rowStyle = isNext ? 'background-color: lightblue;' : '';
        const categoryColor = getRandomColor(row.category);
        const pitchColor = getRandomColor(row.pitch);
        html += `<tr style="${rowStyle}">`;
        html += `<td class="id-column">${row.id ? row.id.toString().slice(-3) : 'N/A'}</td>`;
        html += `<td><span style="${pillStyle(categoryColor)}">${row.category || 'N/A'}</span></td>`;
        html += `<td>${row.grp || 'N/A'}</td>`;
        html += `<td>${processStage(row.stage)}</td>`;
        html += `<td><span style="${pillStyle(pitchColor)}">${row.pitch || 'N/A'}</span></td>`;
        html += `<td>${row.scheduledTime || 'N/A'}</td>`;
        const { teamName: team1Name, teamStyle: team1Style } = processTeamName(row.team1);
        const { teamName: team2Name, teamStyle: team2Style } = processTeamName(row.team2);
        const team1FinalStyle = row.stage !== 'group' && team1Name !== 'TBD' ? 'color: blue; font-weight: bold;' : team1Name === 'TBD' ? 'color: #a9a9a9; font-style: italic; font-weight: bold;' : `${team1Style} font-weight: bold;`;
        const team2FinalStyle = row.stage !== 'group' && team2Name !== 'TBD' ? 'color: blue; font-weight: bold;' : team2Name === 'TBD' ? 'color: #a9a9a9; font-style: italic; font-weight: bold;' : `${team2Style} font-weight: bold;`;
        html += `<td style="${team1FinalStyle}">${team1Name || 'N/A'}</td>`;
        html += `<td style="${team2FinalStyle}">${team2Name || 'N/A'}</td>`;
        const { teamName: umpireTeamName, teamStyle: umpireTeamStyle } = processTeamName(row.umpireTeam);
        const umpireFinalStyle = row.stage !== 'group' && umpireTeamName !== 'TBD' ? 'color: blue;' : umpireTeamName === 'TBD' ? 'color: #a9a9a9; font-style: italic;' : umpireTeamStyle;
        html += `<td style="${umpireFinalStyle}">${umpireTeamName || 'N/A'}</td>`;
        html += '</tr>';
    });
    html += '</table>';

    // Finished Games table
    html += `<h3>Finished Games (${finishedMatches.length}/${totalMatches})</h3>`;
    html += '<table style="margin-top: 20px;">';
    const finishedHeaders = ['ID', 'Category', 'Group', 'Stage', 'Pitch', 'Time', 'Team 1', 'Score', 'Team 2', 'Score'];
    html += `<tr>${finishedHeaders.map(h => h === 'ID' ? `<th class="id-column">${h}</th>` : `<th>${h}</th>`).join('')}</tr>`;
    finishedMatches.forEach(row => {
        const categoryColor = getRandomColor(row.category);
        const pitchColor = getRandomColor(row.pitch);
        html += '<tr>';
        html += `<td class="id-column">${row.id ? row.id.toString().slice(-3) : 'N/A'}</td>`;
        html += `<td><span style="${pillStyle(categoryColor)}">${row.category || 'N/A'}</span></td>`;
        html += `<td>${row.grp || 'N/A'}</td>`;
        html += `<td>${processStage(row.stage)}</td>`;
        html += `<td><span style="${pillStyle(pitchColor)}">${row.pitch || 'N/A'}</span></td>`;
        html += `<td>${row.scheduledTime || 'N/A'}</td>`;
        const { teamName: team1Name, teamStyle: team1Style } = processTeamName(row.team1);
        const { teamName: team2Name, teamStyle: team2Style } = processTeamName(row.team2);
        const team1Score = formatScore(row.goals1, row.points1);
        const team2Score = formatScore(row.goals2, row.points2);
        const score1Style = team1Score === 'N/A' ? 'color:grey;' : '';
        const score2Style = team2Score === 'N/A' ? 'color:grey;' : '';
        html += `<td style="${team1Style} font-weight: bold;">${team1Name || 'N/A'}</td>`;
        html += `<td style="${score1Style}">${team1Score}</td>`;
        html += `<td style="${team2Style} font-weight: bold;">${team2Name || 'N/A'}</td>`;
        html += `<td style="${score2Style}">${team2Score}</td>`;
        html += '</tr>';
    });
    html += '</table>';

    html += '</div>';
    return html;
};
