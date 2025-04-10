const { processTeamName, formatScore } = require('../../../../utils');

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
    return stage === 'group'
        ? 'background-color: rgba(255, 235, 204, 0.8);'
        : 'background-color: rgba(230, 255, 230, 0.8);';
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

// ----- Helper Functions for Modular HTML Generation -----
function generateUpcomingRow(row, index, tournamentId, isHidden, firstMatchId) {
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
      <td style="${getGroupBackground(row.stage)}">${row.grp || 'N/A'}</td>
      <td><span style="${pillStyle(categoryColor)}">${row.category || 'N/A'}</span></td>
      <td>${processStage(row.stage)}</td>
      <td><span style="${pillStyle(pitchColor)}">${row.pitch || 'N/A'}</span></td>
      <td>${row.scheduledTime ? row.scheduledTime.substring(11).trim() : 'N/A'}</td>
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
    const showTime = row.scheduledTime ? row.scheduledTime.substring(11).trim() : 'N/A';
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
      <td style="${getGroupBackground(row.stage)}">${row.grp || 'N/A'}</td>
      <td><span style="${pillStyle(categoryColor)}">${row.category || 'N/A'}</span></td>
      <td>${processStage(row.stage)}</td>
      <td><span style="${pillStyle(pitchColor)}">${row.pitch || 'N/A'}</span></td>
      <td>${showTime}</td>
      <td><team-name direction="r2l" name="${row.team1}" maxchars="25"></team-name></td>
      <td style="${score1Style}">${team1Score}</td>
      <td style="${score2Style}">${team2Score}</td>
      <td><team-name name="${row.team2}" maxchars="25"></team-name></td>
    </tr>`;
}

// ----- Main Exported Function -----
module.exports = function generateMatchesPlanning(data) {
    // Extract unique categories
    const categories = [...new Set(data.matches.map(match => match.category || 'Uncategorized'))].sort();

    let html = '<div id="planning-matches">';
    html += '<h2>Simulate running tournament</h2>';
    html += '<p>Simulate tournament scenarios by playing upcoming matches or import fixtures from a CSV.</p>';

    // Add Category Filter Dropdown
    html += '<div class="mb-4">';
    html += '<label for="category-filter" class="mr-2 font-semibold">Filter by Category:</label>';
    html += '<select id="category-filter" class="p-2 border border-gray-300 rounded" onchange="filterByCategory(this.value)">';
    html += '<option value="">-- Select a Category --</option>';
    html += categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
    html += '</select>';
    html += '</div>';

    html += '<div class="mb-5 overflow-hidden">';
    html += '<button class="bg-red-500 text-white rounded px-3 py-2" hx-get="/planning/' + data.tournamentId + '/reset" hx-target="#planning-matches" hx-swap="outerHTML" hx-trigger="click" hx-on::after-request="htmx.ajax(\'GET\', \'/planning/' + data.tournamentId + '\', \'#planning-matches\')">Reset Tournament</button> ';
    html += '<button class="bg-blue-500 text-white rounded px-3 py-2 ml-2" hx-post="/planning/' + data.tournamentId + '/simulate/1" hx-target="#planning-matches" hx-swap="outerHTML">Play Next Match</button> ';
    html += `<input type="number" id="play-n-matches-input" min="1" class="w-20 ml-2 p-2 bg-white border border-gray-300 rounded" placeholder="N"> `;
    html += `<button class="bg-green-500 text-white rounded px-3 py-2 ml-2" onclick="playNextNMatches(document.getElementById('play-n-matches-input').value, '${data.tournamentId}')">Play Next N Matches</button>`;
    html += '<button class="bg-orange-500 text-white rounded px-3 py-2 ml-2 float-right" hx-get="/planning/' + data.tournamentId + '/import-fixtures" hx-target="body" hx-swap="outerHTML">Import Fixtures</button>';
    html += '</div>';

    // Split matches into upcoming and finished with deterministic sorting
    const upcomingMatches = data.matches
        .filter(match => match.started === 'false')
        .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime) || a.id - b.id);
    const finishedMatches = data.matches
        .filter(match => match.started === 'true')
        .sort((a, b) => b.scheduledTime.localeCompare(a.scheduledTime) || b.id - a.id);
    const totalMatches = data.matches.length; // Keep total count for reference if needed

    // Upcoming Games table
    html += `<h3 id="upcoming-header" style="font-size: 1.25em; margin-top: 30px;">UPCOMING GAMES (0)</h3>`; // Initial count 0
    html += '<table id="upcoming-table" style="width: 100%; border-collapse: collapse;">';
    const upcomingHeaders = ['ID', 'Group', 'Category', 'Stage', 'Pitch', 'Time', 'Team 1', 'Team 2', 'Umpire'];
    html += `<thead><tr>${upcomingHeaders.map(h => `<th style="background-color: transparent; padding: 8px; text-align: left; border-bottom: 1px solid #ccc;">${h.toUpperCase()}</th>`).join('')}</tr></thead>`;
    html += '<tbody>'; // Add tbody
    const firstUpcomingId = upcomingMatches[0] ? upcomingMatches[0].id : null;
    upcomingMatches.forEach((row, index) => {
        // Generate all rows, but they will be hidden initially by filterByCategory('')
        html += generateUpcomingRow(row, index, data.tournamentId, true, firstUpcomingId);
    });
    html += '</tbody></table>'; // Close tbody and table
    // Show More/Less container for Upcoming
    html += `<div id="show-more-container-upcoming" style="margin-top: 10px; text-align: center; display: none;">`; // Initially hidden
    html += `<a id="show-more-upcoming" href="#" style="color: #3498db; text-decoration: underline;">Show More</a>`;
    html += `<a id="show-less-upcoming" href="#" style="color: #3498db; text-decoration: underline; display: none;">Show Less</a>`;
    html += `</div>`;


    // Finished Games table
    html += `<h3 id="finished-header" style="font-size: 1.25em; margin-top: 30px;">FINISHED GAMES (0)</h3>`; // Initial count 0
    html += '<table id="finished-table" style="margin-top: 10px; width: 100%; border-collapse: collapse;">';
    const finishedHeaders = ['ID', 'Group', 'Category', 'Stage', 'Pitch', 'Time', 'Team 1', 'Score', 'Score', 'Team 2'];
    html += `<thead><tr>${finishedHeaders.map(h => `<th style="background-color: transparent; padding: 8px; text-align: left; border-bottom: 1px solid #ccc;">${h.toUpperCase()}</th>`).join('')}</tr></thead>`;
    html += '<tbody>'; // Add tbody
    finishedMatches.forEach((row, index) => {
        // Generate all rows, but they will be hidden initially by filterByCategory('')
        html += generateFinishedRow(row, index, true);
    });
    html += '</tbody></table>'; // Close tbody and table
    // Show More/Less container for Finished
    html += `<div id="show-more-container-finished" style="margin-top: 10px; text-align: center; display: none;">`; // Initially hidden
    html += `<a id="show-more-finished" href="#" style="color: #3498db; text-decoration: underline;">Show More</a>`;
    html += `<a id="show-less-finished" href="#" style="color: #3498db; text-decoration: underline; display: none;">Show Less</a>`;
    html += `</div>`;

    html += '</div>'; // Close planning-matches div

    // --- Inline JavaScript ---
    html += `
        <script>
            // Store original matches data if needed elsewhere, or assume filterByCategory has access
            // const allMatches = ${JSON.stringify(data.matches)}; // Optional: if needed

            // Play N Matches function (existing)
            async function playNextNMatches(n, tournamentId) {
                for (let i = 0; i < n; i++) {
                    await htmx.ajax('POST', '/planning/' + tournamentId + '/simulate/1', {
                        target: '#planning-matches',
                        swap: 'outerHTML'
                    });
                }
            }

            // --- Category Filtering Logic ---
            function filterByCategory(selectedCategory) {
                const upcomingTableBody = document.querySelector('#upcoming-table tbody');
                const finishedTableBody = document.querySelector('#finished-table tbody');
                const allUpcomingRows = upcomingTableBody ? upcomingTableBody.querySelectorAll('tr') : [];
                const allFinishedRows = finishedTableBody ? finishedTableBody.querySelectorAll('tr') : [];
                const upcomingHeader = document.getElementById('upcoming-header');
                const finishedHeader = document.getElementById('finished-header');
                const showMoreUpcomingLink = document.getElementById('show-more-upcoming');
                const showLessUpcomingLink = document.getElementById('show-less-upcoming');
                const showMoreFinishedLink = document.getElementById('show-more-finished');
                const showLessFinishedLink = document.getElementById('show-less-finished');
                const upcomingShowMoreContainer = document.getElementById('show-more-container-upcoming');
                const finishedShowMoreContainer = document.getElementById('show-more-container-finished');

                let visibleUpcomingCount = 0;
                let totalUpcomingInCategory = 0;
                let visibleFinishedCount = 0;
                let totalFinishedInCategory = 0;

                // Hide all rows initially within their respective tbodies
                allUpcomingRows.forEach(row => row.style.display = 'none');
                allFinishedRows.forEach(row => row.style.display = 'none');

                if (selectedCategory) {
                    // Filter and show upcoming rows
                    allUpcomingRows.forEach(row => {
                        if (row.dataset.category === selectedCategory) {
                            totalUpcomingInCategory++;
                            if (visibleUpcomingCount < 10) {
                                row.style.display = ''; // Show row (default display)
                                visibleUpcomingCount++;
                            } else {
                                row.style.display = 'none'; // Ensure it's hidden if beyond limit
                            }
                        }
                    });

                    // Filter and show finished rows
                    allFinishedRows.forEach(row => {
                        if (row.dataset.category === selectedCategory) {
                            totalFinishedInCategory++;
                            if (visibleFinishedCount < 10) {
                                row.style.display = ''; // Show row
                                visibleFinishedCount++;
                            } else {
                                row.style.display = 'none'; // Ensure it's hidden if beyond limit
                            }
                        }
                    });
                }

                // Update headers
                if (upcomingHeader) {
                    upcomingHeader.textContent = \`UPCOMING GAMES (\${totalUpcomingInCategory})\`;
                }
                if (finishedHeader) {
                    finishedHeader.textContent = \`FINISHED GAMES (\${totalFinishedInCategory})\`;
                }

                // Update Show More/Less for Upcoming
                if (upcomingShowMoreContainer) {
                    if (totalUpcomingInCategory > 10) {
                        upcomingShowMoreContainer.style.display = 'block';
                        const moreCount = totalUpcomingInCategory - 10;
                        showMoreUpcomingLink.textContent = \`Show \${moreCount} More\`;
                        showMoreUpcomingLink.style.display = 'inline-block';
                        showLessUpcomingLink.style.display = 'none';
                        // Assign onclick handlers dynamically
                        showMoreUpcomingLink.onclick = (e) => { e.preventDefault(); showMoreRows('upcoming', selectedCategory); };
                        showLessUpcomingLink.onclick = (e) => { e.preventDefault(); showLessRows('upcoming', selectedCategory); };
                    } else {
                        upcomingShowMoreContainer.style.display = 'none';
                    }
                }

                // Update Show More/Less for Finished
                if (finishedShowMoreContainer) {
                    if (totalFinishedInCategory > 10) {
                        finishedShowMoreContainer.style.display = 'block';
                        const moreCount = totalFinishedInCategory - 10;
                        showMoreFinishedLink.textContent = \`Show \${moreCount} More\`;
                        showMoreFinishedLink.style.display = 'inline-block';
                        showLessFinishedLink.style.display = 'none';
                         // Assign onclick handlers dynamically
                        showMoreFinishedLink.onclick = (e) => { e.preventDefault(); showMoreRows('finished', selectedCategory); };
                        showLessFinishedLink.onclick = (e) => { e.preventDefault(); showLessRows('finished', selectedCategory); };
                    } else {
                        finishedShowMoreContainer.style.display = 'none';
                    }
                }
            }

            function showMoreRows(tableType, category) {
                const tableBody = document.querySelector(\`#\${tableType}-table tbody\`);
                const rows = tableBody ? tableBody.querySelectorAll(\`tr[data-category="\${category}"]\`) : [];
                rows.forEach(row => row.style.display = ''); // Show all matching rows
                document.getElementById(\`show-more-\${tableType}\`).style.display = 'none';
                document.getElementById(\`show-less-\${tableType}\`).style.display = 'inline-block';
                return false; // Prevent default link behavior
            }

            function showLessRows(tableType, category) {
                const tableBody = document.querySelector(\`#\${tableType}-table tbody\`);
                const rows = tableBody ? tableBody.querySelectorAll(\`tr[data-category="\${category}"]\`) : [];
                rows.forEach((row, index) => {
                    if (index >= 10) {
                        row.style.display = 'none';
                    } else {
                         row.style.display = ''; // Ensure first 10 are visible
                    }
                });
                document.getElementById(\`show-more-\${tableType}\`).style.display = 'inline-block';
                document.getElementById(\`show-less-\${tableType}\`).style.display = 'none';
                return false; // Prevent default link behavior
            }

            // Initial call to hide everything after the DOM is ready
            // Using setTimeout to ensure DOM elements are available after initial render
            setTimeout(() => {
                 filterByCategory(''); // Hide all on load by default
            }, 0);

        </script>
    `;

    return html;
};
