function parseStageToLevel(stage) {
    if (!stage || typeof stage !== 'string') return 0;

    const [tournamentPart, hierarchyPart] = stage.split('_');

    // Determine tournament offset (for bracket ordering: CUP, SHIELD, PLATE)
    let tournamentOffset = 0;
    switch(tournamentPart.toLowerCase()) {
        case 'cup': tournamentOffset = 0; break;
        case 'shield': tournamentOffset = 100; break;
        case 'plate': tournamentOffset = 200; break;
        case 'spoon': tournamentOffset = 300; break;
        default: tournamentOffset = 0;
    }

    // Determine hierarchy level - lower number = more important match
    // This is used for "completed tournament" view ordering (FIN first, then 3/4, then SF, etc.)
    let hierarchyLevel = 0;
    if (hierarchyPart) {
        const lowerHierarchy = hierarchyPart.toLowerCase();
        if (lowerHierarchy.includes('final')) {
            hierarchyLevel = 1;     // Final is most important
        } else if (lowerHierarchy.includes('3rd') || lowerHierarchy.includes('4th') || lowerHierarchy.endsWith('4th')) {
            hierarchyLevel = 2;     // 3rd/4th playoff
        } else if (lowerHierarchy.includes('semi')) {
            hierarchyLevel = 3;     // Semi-finals
        } else if (lowerHierarchy.includes('5th') || lowerHierarchy.includes('6th') || lowerHierarchy.endsWith('6th')) {
            hierarchyLevel = 4;     // 5th/6th playoff
        } else if (lowerHierarchy.includes('7th') || lowerHierarchy.includes('8th') || lowerHierarchy.endsWith('8th')) {
            hierarchyLevel = 5;     // 7th/8th playoff
        } else if (lowerHierarchy.includes('9th') || lowerHierarchy.includes('10th') || lowerHierarchy.endsWith('10th')) {
            hierarchyLevel = 6;     // 9th/10th playoff
        } else if (lowerHierarchy.includes('quarter')) {
            hierarchyLevel = 10;    // Quarter-finals play first (least important in completed view)
        }
    }

    return tournamentOffset + hierarchyLevel;
}

/**
 * Determine if a tournament is complete (all fixtures have been played)
 * @param {Array} fixtures - Array of fixture objects
 * @returns {boolean} - True if all fixtures are played, false otherwise
 */
function isTournamentComplete(fixtures) {
    if (!fixtures || fixtures.length === 0) return false;
    return fixtures.every(f => f.outcome === 'played');
}

/**
 * Get the chronological play order from a fixture
 * Used for sorting during ongoing tournaments
 * @param {Object} fixture - Fixture object
 * @returns {number} - Order value (lower = plays earlier)
 */
function getPlayOrder(fixture) {
    // If fixture has an explicit order property (0=quarters, 1=semis, 2=finals), use that
    if (typeof fixture.order === 'number') {
        return fixture.order;
    }

    // Fallback: use scheduledTime if available
    if (fixture.scheduledTime) {
        return new Date(fixture.scheduledTime).getTime();
    }

    // Fallback: use stage level (reverse of importance order)
    // This approximates play order: quarters play before semis, semis before finals
    const level = parseStageToLevel(fixture.stage);
    return -level; // Negate so earlier matches (quarters) have lower order values
}

function abbreviateStage(stage) {
    if (!stage || typeof stage !== 'string') return '';
    
    const [tournamentPart, hierarchyPart] = stage.split('_');
    if (!hierarchyPart) return '';

    // Removed tournament prefix logic

    // Determine descriptive stage name
    let stageName = '';
    const lowerHierarchy = hierarchyPart.toLowerCase();

    if (lowerHierarchy.includes('final')) {
        stageName = 'Finals';
    } else if (lowerHierarchy.includes('semi')) {
        stageName = 'Semis';
    } else if (lowerHierarchy.includes('quarter')) {
        stageName = 'Quarters';
    } else if (lowerHierarchy.includes('3rd4th')) {
        stageName = '3rd/4th';
    } else if (lowerHierarchy.includes('4th5th')) {
        stageName = '4th/5th';
    } else if (lowerHierarchy.includes('5th6th')) {
        stageName = '5th/6th';
    } else if (lowerHierarchy.includes('6th7th')) {
        stageName = '6th/7th';
    } else if (lowerHierarchy.includes('7th8th')) {
        stageName = '7th/8th';
    } else {
        // Fallback if no specific match found
        stageName = hierarchyPart; 
    }

    return stageName;
}

module.exports = {
    parseStageToLevel,
    abbreviateStage,
    isTournamentComplete,
    getPlayOrder
};
