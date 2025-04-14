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
module.exports = function generateCompetitionView(data) {
    if (!data || !data.competitionName) {
        return '<p class="error p-4">Missing competition data.</p>';
    }

    const {
        competitionName,
        groupFixtures,
        groupStandings,
        knockoutFixtures,
    } = data;

    // Use a container div for the whole competition view
    let html = `<div id="competition-${encodeURIComponent(competitionName)}" class="competition-view p-4 space-y-6">`; // Add spacing between sections

    // Add sections, using the individual generators
    // Add checks to only render sections if data exists

    // Section: Knockout Fixtures
    if (knockoutFixtures && knockoutFixtures.length > 0) {
        html += '<section id="comp-knockout-fixtures">';
        html += '<h2 class="event-h2 text-xl font-semibold mb-2 mt-4">Knockout Games</h2>'; // Added H2 subheading
        html += generateKnockoutFixtures(knockoutFixtures);
        html += '</section>';
    }

    // Section: Groups (Standings + Fixtures)
    html += '<section id="comp-groups" class="space-y-6">'; // Container for all groups

    // groupStandings is an object keyed by category, e.g., { "Cup": [ { groupName: 'A', rows: [...] }, { groupName: 'B', ... } ] }
    // We expect only one category (competitionName) in the passed groupStandings object here.
    const groupsData = groupStandings && groupStandings[competitionName];

    if (groupsData && Array.isArray(groupsData) && groupsData.length > 0) {
        // Process all fixtures for this competition *once* before looping through groups
        const processedCategoryFixtures = (groupFixtures || [])
            .filter(f => f.category === competitionName) // Ensure we only use fixtures for this competition
            .map(f => {
                const { goals1, points1, goals2, points2 } = f;
                // Ensure scores are numbers, default to 0 if null/undefined for calculation
                const g1 = goals1 ?? 0;
                const p1 = points1 ?? 0;
                const g2 = goals2 ?? 0;
                const p2 = points2 ?? 0;
                const score1 = g1 * 3 + p1;
                const score2 = g2 * 3 + p2;
                return {
                    ...f,
                    // Keep original scores as well
                    goals1, points1, goals2, points2,
                    // Calculated scores/diffs
                    score1,
                    score2,
                    diff1: score1 - score2,
                    diff2: score2 - score1,
                };
            });

        // Sort groups alphabetically by name for consistent order
        groupsData.sort((a, b) => (a.groupName || '').localeCompare(b.groupName || ''));


        html += '<h2 class="event-h2 text-xl font-semibold mb-2 mt-4">Group Games</h2>'; 
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
    html += '</div>'; // Close competition-view container

    return html;
};
