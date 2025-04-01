const { formatScore } = require('../../utils.js');

/**
 * Determines CSS classes for teams and scores based on comparing two formatted scores.
 * Handles numeric scores within parentheses and special string scores.
 * @param {string|null} score1Formatted - Formatted score for team 1 (e.g., "1-05 (8)", "walked", "N/A").
 * @param {string|null} score2Formatted - Formatted score for team 2.
 * @returns {{team1ScoreClass: string, team2ScoreClass: string, team1WinnerClass: string, team2WinnerClass: string}}
 */
function getScoreComparisonClasses(score1Formatted, score2Formatted) {
    const specialScores = ['walked', 'concede', 'shared'];
    const score1Lower = score1Formatted?.toLowerCase();
    const score2Lower = score2Formatted?.toLowerCase();

    // If either score is special, apply neutral classes
    if (specialScores.includes(score1Lower) || specialScores.includes(score2Lower)) {
        return { team1ScoreClass: '', team2ScoreClass: '', team1WinnerClass: '', team2WinnerClass: '' };
    }

    // Function to extract numeric total points from formatted score like "G-PP (TT)"
    const extractScoreValue = score => {
        const match = score?.match(/\((\d+)\)/);
        // Return -1 if score is null, N/A, or doesn't match the expected format
        return match ? parseInt(match[1], 10) : -1; 
    };

    const score1Value = extractScoreValue(score1Formatted);
    const score2Value = extractScoreValue(score2Formatted);

    let team1ScoreClass = '', team2ScoreClass = '';
    let team1WinnerClass = '', team2WinnerClass = '';

    // Handle cases where one or both scores are invalid/N/A
    if (score1Value === -1 || score2Value === -1) { 
        team1ScoreClass = team2ScoreClass = ''; 
    } else if (score1Value > score2Value) {
        team1ScoreClass = 'score-winner';
        team2ScoreClass = 'score-loser';
        team1WinnerClass = 'team-winner';
    } else if (score1Value < score2Value) {
        team1ScoreClass = 'score-loser';
        team2ScoreClass = 'score-winner';
        team2WinnerClass = 'team-winner';
    } else { // Draw
        team1ScoreClass = team2ScoreClass = 'score-draw';
    }
    return { team1ScoreClass, team2ScoreClass, team1WinnerClass, team2WinnerClass };
}

/**
 * Formats final scores, handling 'not played' outcomes like walkovers or concessions.
 * @param {number|null} goals1 - Team 1 goals.
 * @param {number|null} points1 - Team 1 points.
 * @param {number|null} goals2 - Team 2 goals.
 * @param {number|null} points2 - Team 2 points.
 * @param {string|null} outcome - Match outcome (e.g., 'played', 'not played').
 * @returns {{team1ScoreFinal: string, team2ScoreFinal: string}} Formatted scores (e.g., "1-05 (8)", "walked", "N/A").
 */
function getFinalScoreDisplay(goals1, points1, goals2, points2, outcome) {
    // Get the standard score format first
    let team1ScoreFinal = formatScore(goals1, points1);
    let team2ScoreFinal = formatScore(goals2, points2);

    // Override with special strings if the outcome is 'not played' and scores match walkover patterns
    if (outcome === 'not played') {
        // Standard walkover/concession logic (adjust if your point system differs)
        // Assumes 0-01 (1) point awarded for a walkover win, 0-00 (0) for concession/loss.
        if (goals1 === 0 && points1 === 0 && goals2 === 0 && points2 === 1) { // Team 2 wins walkover
            team1ScoreFinal = 'concede';
            team2ScoreFinal = 'walked';
        } else if (goals2 === 0 && points2 === 0 && goals1 === 0 && points1 === 1) { // Team 1 wins walkover
            team1ScoreFinal = 'walked';
            team2ScoreFinal = 'concede';
        } else if (goals1 === 0 && points1 === 0 && goals2 === 0 && points2 === 0) { // Both teams 0-00, could be 'shared' or 'not played'
            team1ScoreFinal = 'shared'; // Or 'N/P' for Not Played, depending on desired display
            team2ScoreFinal = 'shared'; // Or 'N/P'
        }
        // Add more conditions here if other score patterns represent specific 'not played' outcomes
    }
    return { team1ScoreFinal, team2ScoreFinal };
}

module.exports = {
  getScoreComparisonClasses,
  getFinalScoreDisplay,
};
