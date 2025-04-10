function parseStageToLevel(stage) {
    if (!stage || typeof stage !== 'string') return 0;
    
    const [tournamentPart, hierarchyPart] = stage.split('_');
    
    // Determine tournament offset
    let tournamentOffset = 0;
    switch(tournamentPart.toLowerCase()) {
        case 'cup': tournamentOffset = 0; break;
        case 'shield': tournamentOffset = 3; break;
        case 'plate': tournamentOffset = 6; break;
        case 'spoon': tournamentOffset = 9; break;
        default: tournamentOffset = 0;
    }

    // Determine hierarchy level
    let hierarchyLevel = 0;
    if (hierarchyPart) {
        const lowerHierarchy = hierarchyPart.toLowerCase();
        if (lowerHierarchy.includes('final')) {
            hierarchyLevel = 1.0;
        } else if (lowerHierarchy.endsWith('4th')) {
            hierarchyLevel = 2.0;
        } else if (lowerHierarchy.includes('semi')) {
            hierarchyLevel = 2.1;
        } else if (lowerHierarchy.endsWith('8th')) {
            hierarchyLevel = 3.1;
        } else if (lowerHierarchy.endsWith('7th')) {
            hierarchyLevel = 3.2;
        } else if (lowerHierarchy.endsWith('6th')) {
            hierarchyLevel = 3.3;
        } else if (lowerHierarchy.endsWith('5th')) {
            hierarchyLevel = 3.4;
        } else if (lowerHierarchy.includes('quarter')) {
            hierarchyLevel = 3.5;
        }
    }

    return tournamentOffset + hierarchyLevel;
}

function abbreviateStage(stage) {
    if (!stage || typeof stage !== 'string') return '';
    
    const [tournamentPart, hierarchyPart] = stage.split('_');
    if (!hierarchyPart) return '';

    // Determine tournament prefix
    let prefix = '';
    switch(tournamentPart.toLowerCase()) {
        case 'cup': prefix = 'C'; break;
        case 'shield': prefix = 'S'; break;
        case 'plate': prefix = 'P'; break;
        case 'spoon': prefix = 'O'; break;
        default: prefix = '';
    }

    // Determine hierarchy suffix (handle specific playoffs first)
    let suffix = '';
    const lowerHierarchy = hierarchyPart.toLowerCase();

    if (lowerHierarchy.includes('final')) {
        suffix = 'F';
    } else if (lowerHierarchy.includes('semi')) {
        suffix = 'S';
    } else if (lowerHierarchy.includes('quarter')) {
        suffix = 'Q';
    } else if (lowerHierarchy.includes('3rd4th')) { // Simplified suffix
        suffix = '4';
    } else if (lowerHierarchy.includes('4th5th')) { // Added check
        suffix = '5';
    } else if (lowerHierarchy.includes('5th6th')) { // Simplified suffix
        suffix = '6';
    } else if (lowerHierarchy.includes('6th7th')) { // Added check (just in case)
        suffix = '7';
    } else if (lowerHierarchy.includes('7th8th')) { // Simplified suffix
        suffix = '8';
    }
    // Removed unreliable fallback logic

    return prefix + suffix;
}

module.exports = {
    parseStageToLevel,
    abbreviateStage
};
