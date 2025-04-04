// Import individual section generators
const generateGroupFixtures = require('./groupFixtures');
const generateGroupStandings = require('./groupStandings');
const generateKnockoutFixtures = require('./knockoutFixtures');
const generateFinalsResults = require('./finalsResults');

/**
 * Generates the combined HTML view for a single competition.
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
        finalsResults
    } = data;

    // Use a container div for the whole competition view
    let html = `<div id="competition-${encodeURIComponent(competitionName)}" class="competition-view p-4 space-y-6">`; // Add spacing between sections

    // Add sections, using the individual generators
    // Add checks to only render sections if data exists

    // Section: Group Fixtures
    if (groupFixtures && groupFixtures.length > 0) {
        html += '<section id="comp-group-fixtures">';
        html += '<h2 class="text-xl font-semibold mb-2 mt-4">Group Games</h2>'; // Added H2 subheading
        html += generateGroupFixtures(groupFixtures);
        html += '</section>';
    } else {
        // Optional: message if no group fixtures
       html += '<p>No group games scheduled for this competition.</p>';
    }

    // groupStandings is an object keyed by category, but should only contain the current competition
    const standingsForCompetition = groupStandings && groupStandings[competitionName];
    if (standingsForCompetition && Object.keys(standingsForCompetition).length > 0) {
        html += '<section id="comp-group-standings">';
        html += '<h2 class="text-xl font-semibold mb-2 mt-4">Group Tables</h2>'; // Added H2 subheading
        html += generateGroupStandings(
          { [competitionName]: standingsForCompetition },
          groupFixtures,
        );
        html += '</section>';
    } else {
         // Optional: message if no group standings
       html += '<p>No group standings available for this competition.</p>';
    }


    // Section: Knockout Fixtures
    if (knockoutFixtures && knockoutFixtures.length > 0) {
        html += '<section id="comp-knockout-fixtures">';
        html += '<h2 class="text-xl font-semibold mb-2 mt-4">Knockout Games</h2>'; // Added H2 subheading
        html += generateKnockoutFixtures(knockoutFixtures);
        html += '</section>';
    } else {
         // Optional: message if no knockout fixtures
        // html += '<p>No knockout games scheduled for this competition.</p>';
    }

    // Section: Finals Results
    if (finalsResults && finalsResults.length > 0) {
        html += '<section id="comp-finals-results">';
        html += '<h2 class="text-xl font-semibold mb-2 mt-4">Finals</h2>'; // Added H2 subheading
        html += generateFinalsResults(finalsResults);
        html += '</section>';
    } else {
         // Optional: message if no finals results
        // html += '<p>No finals results available for this competition.</p>';
    }

    // Add more sections here if needed (e.g., Carded Players filtered by competition)

    html += '</div>'; // Close competition-view container

    return html;
};
