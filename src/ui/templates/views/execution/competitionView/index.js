//
// Route: 

// Import individual section generators
const generateSingleGroupFixtures = require('./partials/groupFixtures'); // Renamed import
const generateSingleGroupStandings = require('./partials/groupStandings'); // Renamed import
const generateKnockoutFixtures = require('./partials/knockoutFixtures');

/**
 * Generates the combined HTML view for a single competition, grouping standings and fixtures by group.
 * @param {object} data - The combined data object from getCompetitionData.
 *                        Expected keys: competitionName, groupFixtures, groupStandings,
 *                        knockoutFixtures, finalsResults.
 * @returns {string} - The HTML string for the combined view.
 */
function generateCompetitionView(data, editable = false, tournamentId = '') {
    if (!data || !data.competitionName) {
        return '<p class="error p-4">Missing competition data.</p>';
    }

    const {
        competitionName,
        groupFixtures,
        groupStandings,
        knockoutFixtures,
    } = data;

    const rawGroupsData = groupStandings && groupStandings[competitionName];
    const groupsData = Array.isArray(rawGroupsData) ? [...rawGroupsData] : [];
    const hasGroupContent = groupsData.length > 0;
    const isFixturePlayed = fixture =>
        typeof fixture.goals1 === 'number' && typeof fixture.points1 === 'number' &&
        typeof fixture.goals2 === 'number' && typeof fixture.points2 === 'number';

    let processedCategoryFixtures = [];
    let hasPendingGroupFixtures = false;

    if (hasGroupContent) {
        processedCategoryFixtures = (groupFixtures || [])
            .filter(f => f.category === competitionName)
            .map(f => {
                const { goals1, points1, goals2, points2 } = f;
                const g1 = goals1 ?? 0;
                const p1 = points1 ?? 0;
                const g2 = goals2 ?? 0;
                const p2 = points2 ?? 0;
                const score1 = g1 * 3 + p1;
                const score2 = g2 * 3 + p2;
                return {
                    ...f,
                    goals1,
                    points1,
                    goals2,
                    points2,
                    score1,
                    score2,
                    diff1: score1 - score2,
                    diff2: score2 - score1,
                };
            });

        hasPendingGroupFixtures = processedCategoryFixtures.some(f => !isFixturePlayed(f));
        groupsData.sort((a, b) => (a.groupName || '').localeCompare(b.groupName || ''));
    }

    const hasKnockoutFixtures = Array.isArray(knockoutFixtures) && knockoutFixtures.length > 0;
    let defaultTab = 'knockout';
    if (hasGroupContent && (hasPendingGroupFixtures || !hasKnockoutFixtures)) {
        defaultTab = 'groups';
    }

    const knockoutTabActiveClass = defaultTab === 'knockout' ? 'active' : '';
    const groupsTabActiveClass = defaultTab === 'groups' ? 'active' : '';
    const knockoutSectionDisplay = defaultTab === 'knockout' ? 'block' : 'none';
    const groupsSectionDisplay = defaultTab === 'groups' ? 'block' : 'none';
    const knockoutSectionClass = `tab-content${defaultTab === 'knockout' ? ' active' : ''}`;
    const groupsSectionClass = `tab-content${defaultTab === 'groups' ? ' active' : ''}`;

    // Use a container div for the whole competition view
    let html = `
    <div id="competition-${encodeURIComponent(competitionName)}" class="competition-view p-4 space-y-6">
        <div id="competition-loading" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
            <p class="mt-4 text-lg">Loading competition data...</p>
        </div>
        <div id="competition-content" class="hidden">`;

    // Add sections, using the individual generators
    // Add checks to only render sections if data exists

    // Tab Navigation
    html += `
    <style>
        .competition-tabs {
            margin-bottom: 1rem;
            width: 100%;
        }
        .competition-tabs .flex {
            display: flex;
            width: 100%;
        }
        .competition-tabs .tab-button {
            flex: 1;
            text-align: center;
            font-weight: 500;
            text-transform: uppercase;
            font-size: 2rem;
            padding: 2.4rem 0.4rem;
            background: #e0d1d6;
            color: #777;
            border-top-right-radius: 1rem;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
            margin-top:2rem;
        }
        .competition-tabs .tab-button.active {
            background: #d5a8b6;
            color: white;
            font-weight: bold;
        }
    </style>
    <div class="competition-tabs">
        <div class="flex">
            <button class="tab-button${knockoutTabActiveClass ? ` ${knockoutTabActiveClass}` : ''}" data-tab="knockout-tab">Knockout Games</button>
            <button class="tab-button${groupsTabActiveClass ? ` ${groupsTabActiveClass}` : ''}" data-tab="groups-tab">Group Games</button>
        </div>
    </div>
    `;

    // Section: Knockout Fixtures
    html += `<section id="comp-knockout-fixtures" class="${knockoutSectionClass}" data-tab-content="knockout-tab" style="display: ${knockoutSectionDisplay};">`;
    if (hasKnockoutFixtures) {
        html += generateKnockoutFixtures(knockoutFixtures, editable, tournamentId);
    } else {
        html += '<p>No knockout fixtures found.</p>';
    }
    html += '</section>';

    // Section: Groups (Standings + Fixtures)
    html += `<section id="comp-groups" class="${groupsSectionClass}" data-tab-content="groups-tab" style="display: ${groupsSectionDisplay};">`; // Container for all groups

    if (hasGroupContent) {
        // Loop through each group within the competition
        groupsData.forEach(groupData => {
            const groupName = groupData.groupName;
            if (!groupName) {
                console.error("Skipping group due to missing groupName:", groupData);
                return; // Skip if groupName is missing
            }

            html += `<div class="group-section border rounded p-4 bg-gray-50 mb-6">`; // Wrapper for each group
            html += `<h3 class="group-header uppercase text-center font-bold text-xl mb-4">GROUP ${groupName.toUpperCase()}</h3>`;

            // 1. Sort Group Standings Rows
            if (groupData.rows && groupData.rows.length > 0) {
                groupData.rows.sort((a, b) => {
                    if (b.TotalPoints !== a.TotalPoints) return b.TotalPoints - a.TotalPoints;
                    if (b.PointsDifference !== a.PointsDifference) return b.PointsDifference - a.PointsDifference;
                    if (b.PointsFrom !== a.PointsFrom) return b.PointsFrom - a.PointsFrom;
                    // Add a tie-breaker if needed, e.g., team name
                    return (a.team || '').localeCompare(b.team || '');
                });
            } else {
                groupData.rows = []; // Ensure rows is an array even if empty
            }


            // 2. Generate Standings Table for this group
            html += '<div class="group-standings-container mb-4">'; // Container for standings
            html += generateSingleGroupStandings(groupData, processedCategoryFixtures);
            html += '</div>';

            // 3. Filter Fixtures for this specific group
            const fixturesForThisGroup = processedCategoryFixtures.filter(f => +f.g === +groupName);
            console.log(`--- Group: ${groupName} ---`);
            console.log(`Found ${fixturesForThisGroup.length} fixtures for this group:`, fixturesForThisGroup.map(f => `${f.team1} vs ${f.team2}`)); // Log teams for easier debugging

            // 4. Generate Fixtures Table for this group
            html += '<div class="group-fixtures-container">'; // Container for fixtures
            html += `<h4 class="text-lg font-semibold mb-2 text-center">Group ${groupName} Games</h4>`; // Sub-header for fixtures
            // Temporarily pass ALL processed fixtures instead of filtered ones for debugging
            html += generateSingleGroupFixtures(fixturesForThisGroup, groupName);
            html += '</div>';

            html += `</div>`; // Close group-section wrapper
        });

    } else {
        // Message if no group data at all for this competition
        html += '<p>No group data available for this competition.</p>';
    }

    html += '</section>'; // Close comp-groups section
    // Add the styles previously removed from groupStandings.js
    html += `<link rel="text/css" href="/styles/competitionView.style.css" /> `;
    html += `<script src="/scripts/webcomponents/fixture-row.js"></script>`;
    html += `
        </div>
    </div>
    <script src="/scripts/competitionView.public.js"></script>
    `;

    return html;
};

module.exports = generateCompetitionView
