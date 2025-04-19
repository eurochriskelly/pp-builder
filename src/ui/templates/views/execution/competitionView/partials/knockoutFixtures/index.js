const { parseStageToLevel } = require('../../../../../../utils/stageParser');

// Define the desired order for tournament parts
const tournamentPartOrder = ['cup', 'shield', 'plate'];

function getTeamLastFixtures(categoryData) {
    const teamLastFixtures = {};
    categoryData.forEach(match => {
        if (match.outcome === 'played') {
            teamLastFixtures[match.team1] = match;
            teamLastFixtures[match.team2] = match;
        }
    });
    return Object.entries(teamLastFixtures).map(([team, fixture]) => ({
        team,
        lastFixture: fixture
    }));
}

function createKnockoutHTML(categoryData, editable = false, tournamentId = '') {
    let html = '';
    // Get each team's last match
    const teamLastFixtures = getTeamLastFixtures(categoryData);

    // First group fixtures by tournament part (CUP, SHD, etc)
    const fixturesByTournamentPart = {};
    categoryData.forEach(row => {
        const stageParts = row.stage?.split('_') || [];
        const tournamentPart = stageParts[0]?.trim().toLowerCase() || 'unknown';
        if (!fixturesByTournamentPart[tournamentPart]) {
            fixturesByTournamentPart[tournamentPart] = [];
        }
        fixturesByTournamentPart[tournamentPart].push({
            ...row,
            stageLevel: parseStageToLevel(row.stage)
        });
    });

    // Sort each tournament part's fixtures by stage level
    for (const tournamentPart in fixturesByTournamentPart) {
        fixturesByTournamentPart[tournamentPart].sort((a, b) => a.stageLevel - b.stageLevel);
    }

    // Get sorted tournament part keys based on predefined order
    const sortedTournamentParts = Object.keys(fixturesByTournamentPart).sort((a, b) => {
        const indexA = tournamentPartOrder.indexOf(a.toLowerCase());
        const indexB = tournamentPartOrder.indexOf(b.toLowerCase());
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return a.localeCompare(b);
    });

    for (const tournamentPart of sortedTournamentParts) {
        const fixtures = fixturesByTournamentPart[tournamentPart];
        if (!fixtures || fixtures.length === 0) continue;
        const tournamentPartDisplay = tournamentPart.toUpperCase();
        html += `<h3 class="knockout-part-header group-header uppercase text-center font-bold text-xl mb-4">${tournamentPartDisplay}</h3>`;

        fixtures.forEach((row, idx) => {
            const stageParts = row.stage?.split('_') || [];
            // Only swap display order if team2 won and it's a played match
            let team1 = row.team1;
            let team2 = row.team2;
            let goals1 = row.goals1;
            let points1 = row.points1;
            let goals2 = row.goals2;
            let points2 = row.points2;

            const team1Won = row.outcome === 'played' &&
                (row.goals1 * 3 + row.points1) > (row.goals2 * 3 + row.points2);
            const team2Won = row.outcome === 'played' &&
                (row.goals2 * 3 + row.points2) > (row.goals1 * 3 + row.points1);

            if (row.outcome === 'played' && team2Won) {
                [team1, team2] = [team2, team1];
                [goals1, points1, goals2, points2] = [goals2, points2, goals1, points1];
            }

            // Check if this is each team's last match
            const isTeam1Last = teamLastFixtures.some(f => f.team === team1 && f.lastFixture === row);
            const isTeam2Last = teamLastFixtures.some(f => f.team === team2 && f.lastFixture === row);

            // Determine round and progression based on stage
            const roundName = stageParts[0]?.toLowerCase() || '';
            let progression = 0;
            if (roundName === 'cup') round = 0;
            else if (roundName === 'shield') round = 3;
            else if (roundName === 'plate') round = 6;

            const hierarchyPart = stageParts[1]?.toLowerCase() || '';
            if (hierarchyPart.includes('final')) {
                progression = 1;
            } else if (hierarchyPart.includes('semi') ||
                hierarchyPart.includes('3rd4th')) {
                progression = 2;
            } else if (hierarchyPart.includes('quarter') ||
                hierarchyPart.includes('4th5th') ||
                hierarchyPart.includes('5th6th') ||
                hierarchyPart.includes('6th7th') ||
                hierarchyPart.includes('7th8th')) {
                progression = 3;
            } else {
                progression = 0;
            }

            // Compose fixture-row HTML
            // When editable, wrap the row & inject pencil icon + hidden edit container
            if (editable) {
                html += `<div class="fixture-edit-wrapper relative">`;
                html += `<div class="edit-icon absolute left-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-2xl"
                         hx-get="/execution/${tournamentId}/fixture/${row.id}/edit"
                         hx-target="#edit-dialog-content-${row.id}"
                         hx-swap="innerHTML"
                         hx-on="htmx:afterSwap: document.getElementById('edit-dialog-${row.id}').showModal()">
                        <i data-lucide="pencil-line" style="width: 2em; height: 2em;"></i>
                        </div>`;
                html += `<div class="fixture-row-wrapper">`;
            }
            html += `
<fixture-row
    row-index="${idx}"
    team1="${team1.replace(/"/g, '&quot;')}"
    team1-goals="${goals1}"
    team1-points="${points1}"
    team2="${team2.replace(/"/g, '&quot;')}"
    team2-goals="${goals2}"
    team2-points="${points2}"
    outcome="${row.outcome || ''}"
    match-id="${row.id || ''}"
    stage="${row.stage || ''}"
    stage-level="${row.stageLevel || ''}"
    category="${row.category || ''}"
>
    ${isTeam1Last ? `<span slot="child1" title="Last match">X</span>` : ''}
    ${isTeam2Last ? `<span slot="child2" title="Last match">X</span>` : ''}
</fixture-row>
            `;
            if (editable) {
                html += `</div>`; // close fixture-row-wrapper
                html += `<dialog id="edit-dialog-${row.id}" class="edit-dialog p-4 bg-white rounded shadow-lg relative mt-2">
                            <button class="dialog-close absolute top-4 right-4 text-gray-600 text-2xl" 
                                    onclick="this.closest('dialog').close()">×</button>
                            <div id="edit-dialog-content-${row.id}"></div>
                         </dialog>`;
                html += `</div>`; // close fixture-edit-wrapper
            }
        });
    }
    return html;
}

module.exports = function generateKnockoutFixtures(data, editable = false, tournamentId = '') {
    let html = '<div id="knockout-fixtures">';
    // Group data by category and sort by stage level
    const groupedData = data.reduce((acc, row) => {
        const category = row.category || 'Uncategorized';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push({
            ...row,
            stageLevel: parseStageToLevel(row.stage)
        });
        return acc;
    }, {});

    // Sort each category's matches by stage level (lowest first)
    for (const category in groupedData) {
        groupedData[category].sort((a, b) => a.stageLevel - b.stageLevel);
    }

    // Generate fixture-row HTML for each category
    for (const category in groupedData) {
        const categoryData = groupedData[category];
        html += createKnockoutHTML(categoryData, editable, tournamentId);
    }

    if (Object.keys(groupedData).length === 0) {
        html += '<p>No knockout fixtures found.</p>';
    }

    html += `
    </div>
    <script src="/scripts/knockoutFixtures.public.js"></script>
    <script src = "https://unpkg.com/lucide@latest/dist/umd/lucide.js" ></script>
    <script > lucide.createIcons();</script>
    `;
    return html;
};
