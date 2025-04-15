const { processTeamName } = require('../../../../../../utils');

/**
 * Generates HTML for a single group's fixtures using fixture-row web component.
 * @param {Array} groupFixtures - Array of fixture objects for the specific group.
 * @param {string} groupName - The name of the group (used for empty message).
 * @returns {string} HTML string for the group fixtures, or an error message.
 */
function generateSingleGroupFixtures(groupFixtures, groupName) {
    console.log(`generateSingleGroupFixtures called for Group ${groupName} with ${groupFixtures?.length ?? 0} fixtures.`);

    // Handle case where data is undefined or empty
    if (!groupFixtures || groupFixtures.length === 0) {
        console.log(`--> No fixtures found for Group ${groupName}, returning empty message.`);
        // Return just the paragraph, the caller will handle wrapping divs/headers
        return `<p>No group fixtures found for Group ${groupName}.</p>`;
    }

    // Render each fixture as a fixture-row component
    let html = `<div class="group-fixtures-list">`;
    groupFixtures.forEach(row => {
        // Calculate total scores (3 points per goal + 1 point per point)
        const team1Total = (row.goals1 * 3) + row.points1;
        const team2Total = (row.goals2 * 3) + row.points2;
        const team1Won = team1Total > team2Total;
        const team2Won = team2Total > team1Total;
        const isPlayed = typeof row.goals1 === 'number' && typeof row.points1 === 'number' &&
            typeof row.goals2 === 'number' && typeof row.points2 === 'number';

        html += `
<fixture-row
    team1="${row.team1.replace(/"/g, '&quot;')}"
    team1-goals="${row.goals1}"
    team1-points="${row.points1}"
    team2="${row.team2.replace(/"/g, '&quot;')}"
    team2-goals="${row.goals2}"
    team2-points="${row.points2}"
    outcome="${isPlayed ? 'played' : ''}"
    match-id="${row.id || ''}"
    stage="group"
    stage-level=""
    category="${groupName || ''}"
>
    ${team1Won ? `<span slot="child1" title="Winner">◄</span>` : ''}
    ${team2Won ? `<span slot="child2" title="Winner">►</span>` : ''}
</fixture-row>
        `;
    });
    html += `</div>`;
    return html;
}

// Export the new function name
module.exports = generateSingleGroupFixtures;
