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
    abbreviateStage
};
