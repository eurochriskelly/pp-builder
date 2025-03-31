// Import the new combined view generator
const generateCompetitionView = require('../templates/views/execution/competitionView');
// Import the combined data fetch function
const { getCompetitionData } = require('../queries/matches');

// Define the single view configuration for the combined competition display
const allowedViews = {
    'competition': { // Use a descriptive key like 'competition'
        title: 'Competition View', // Generic title, actual H1 will use competition name
        generator: generateCompetitionView,
        fetch: getCompetitionData // Use the function that fetches all data
    }
    // Keep other views like 'recent', 'cardedPlayers', 'matchesByPitch' if they
    // should remain accessible via direct URLs or other means.
    // If not, remove their generators and fetch functions imports as well.
    // For now, we assume they might be needed elsewhere or removed later.
};

module.exports = { allowedViews };
