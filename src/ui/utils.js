function processTeamName(teamName) {
    let teamStyle = '';

    if (teamName && teamName?.startsWith('~match:')) {
        const match = teamName.match(/~match:(\d+)\/p:(\d+)/);
        if (match) {
            const fullMatchId = match[1];
            const participant = match[2];
            const NNN = fullMatchId.slice(-3);
            let role = participant === '1' ? 'WINNER' : 'LOSER';
            teamName = `${role} of ${NNN}`;
            teamStyle = 'color:grey;';
        } else {
            teamName = 'TBD';
            teamStyle = 'color:grey;';
        }
    }
    return { teamName, teamStyle };
}

function formatScore(goals, points) {
    if (goals == null || points == null) { // Use == null to check for both null and undefined
        return 'N/A';
    }
    const paddedPoints = points.toString().padStart(2, '0');
    const calculatedScore = (goals * 3 + points).toString().padStart(2, '0');
    // Wrap goals-points in a nowrap span, and total in a separate span, add space between
    return `<span style="white-space: nowrap;">${goals}-${paddedPoints}</span> <span>(${calculatedScore})</span>`;
}

/**
 * Generates a short label (up to 3 chars) from the capital letters and numbers in a team name.
 * @param {string} teamName - The full name of the team.
 * @returns {string} - The generated short label (e.g., "IU1", "FD", "AA"). Returns '???' if no label can be generated.
 */
function generateTeamLabel(teamName) {
    if (!teamName || typeof teamName !== 'string') {
        return '???'; // Handle null, undefined, or non-string input
    }
    // Extract capital letters and numbers
    const extracted = teamName.match(/[A-Z0-9]/g);
    if (!extracted || extracted.length === 0) {
        // Fallback: Use first 3 letters if no caps/numbers found
        return teamName.substring(0, 3).toUpperCase(); 
    }
    // Join the extracted characters and take the first 3
    return extracted.join('').substring(0, 3);
}

module.exports = { processTeamName, formatScore, generateTeamLabel };
