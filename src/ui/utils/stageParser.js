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

    // Determine hierarchy suffix
    let suffix = '';
    const lowerHierarchy = hierarchyPart.toLowerCase();
    if (lowerHierarchy.includes('final')) {
        suffix = 'F';
    } else if (lowerHierarchy.includes('3rd') || lowerHierarchy.includes('4th')) {
        suffix = '4';
    } else if (lowerHierarchy.includes('semi')) {
        suffix = 'S';
    } else if (lowerHierarchy.includes('7th') || lowerHierarchy.includes('8th')) {
        suffix = '8';
    } else if (lowerHierarchy.includes('6th') || lowerHierarchy.includes('7th')) {
        suffix = '7';
    } else if (lowerHierarchy.includes('5th') || lowerHierarchy.includes('6th')) {
        suffix = '6';
    } else if (lowerHierarchy.includes('4th') || lowerHierarchy.includes('5th')) {
        suffix = '5';
    } else if (lowerHierarchy.includes('quarter')) {
        suffix = 'Q';
    }

    return prefix + suffix;
}

module.exports = {
    parseStageToLevel,
    abbreviateStage
};
