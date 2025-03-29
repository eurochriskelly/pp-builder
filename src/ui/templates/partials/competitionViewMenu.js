const { allowedViews } = require('../../config/allowedViews');

/**
 * Generates the secondary navigation menu for different views within a selected competition.
 * @param {string} uuid - The tournament UUID.
 * @param {string} competitionName - The currently selected competition name.
 * @param {string} currentView - The view currently being displayed (e.g., 'view7').
 * @returns {string} HTML string for the secondary menu.
 */
function generateCompetitionViewMenu(uuid, competitionName, currentView = 'view7') {
    const encodedCompName = encodeURIComponent(competitionName);
    let html = '<nav class="competition-view-nav flex justify-center space-x-4 p-2 border-b border-gray-300">'; // Added styling

    Object.entries(allowedViews).forEach(([viewKey, viewConfig]) => {
        const isActive = viewKey === currentView;
        const activeClass = isActive ? 'active-view font-bold text-blue-600' : 'text-gray-700 hover:text-blue-500'; // Style active link
        html += `
            <a href="/event/${uuid}/${viewKey}?competition=${encodedCompName}" 
               hx-get="/event/${uuid}/${viewKey}-update?competition=${encodedCompName}"
               hx-target="#content"
               hx-swap="innerHTML"
               class="competition-view-link ${activeClass}">
                ${viewConfig.title}
            </a>
        `;
    });

    html += '</nav>';
    return html;
}

module.exports = { generateCompetitionViewMenu };
