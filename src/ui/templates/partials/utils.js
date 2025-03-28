const { processTeamName, formatScore } = require('../../utils');

/**
 * Generates a generic table cell (<td>).
 * @param {string|number|null} content - The content for the cell.
 * @param {string} [className=''] - Optional CSS class(es) for the cell.
 * @param {string} [style=''] - Optional inline style(s) for the cell.
 * @returns {string} HTML string for a <td> element.
 */
function generateTableCell(content, className = '', style = '') { // Keep style for dynamic team colors for now
  const combinedClassName = className || '';
  return `<td class="${combinedClassName}" style="${style}">${content ?? 'N/A'}</td>`;
}

/**
 * Generates a table cell specifically for IDs, showing the last 3 digits.
 * @param {number|string|null} id - The ID.
 * @param {string} [className='id-column'] - Optional CSS class(es).
 * @returns {string} HTML string for a <td> element.
 */
function generateIdCell(id, className = 'id-column') {
  const idContent = id ? String(id).slice(-3) : 'N/A';
  return generateTableCell(idContent, className);
}

/**
 * Generates a table cell for a team name, applying specific styling.
 * @param {string|null} team - The team name.
 * @param {string} [className=''] - Optional CSS class(es).
 * @returns {string} HTML string for a <td> element.
 */
function generateTeamCell(team, className = '') {
  const { teamName, teamStyle } = processTeamName(team);
  return generateTableCell(teamName, className, teamStyle);
}

/**
 * Generates a table cell for a score, applying specific styling.
 * @param {number|null} goals - Goals scored.
 * @param {number|null} points - Points scored.
 * @param {string} [className=''] - Optional CSS class(es).
 * @param {string} [defaultStyle=''] - Default style if score is valid.
 * @param {string} [naStyle='color:grey;'] - Style if score is N/A.
 * @returns {string} HTML string for a <td> element.
 */
function generateScoreCell(goals, points, className = '', defaultStyle = '') { // Removed naStyle
  const score = formatScore(goals, points);
  const finalClassName = `${className} ${score === 'N/A' ? 'text-grey' : ''}`.trim();
  // Keep defaultStyle for now, could be replaced by classes later if needed
  return generateTableCell(score, finalClassName, defaultStyle); 
}

/**
 * Generates a table header cell (<th>).
 * @param {string} content - The header content.
 * @param {string} [className=''] - Optional CSS class(es).
 * @param {string} [style=''] - Optional inline style(s).
 * @returns {string} HTML string for a <th> element.
 */
function generateTableHeaderCell(content, className = '', style = '') {
    const combinedClassName = className || '';
    return `<th class="${combinedClassName}" style="${style}">${content}</th>`;
}

/**
 * Generates a table header row (<tr><th>...</th></tr>).
 * @param {string[]} headers - Array of header strings.
 * @param {Object.<string, {className?: string, style?: string}>} [headerConfig={}] - Optional config for specific headers.
 * @returns {string} HTML string for a <tr> element containing header cells.
 */
function generateTableHeaderRow(headers, headerConfig = {}) {
    let html = '<tr>';
    html += headers.map(header => {
        const config = headerConfig[header] || {};
        return generateTableHeaderCell(header, config.className || '', config.style || '');
    }).join('');
    html += '</tr>';
    return html;
}

module.exports = {
  generateTableCell,
  generateIdCell,
  generateTeamCell,
  generateScoreCell,
  generateTableHeaderCell,
  generateTableHeaderRow,
  generateSpanningHeaderRow,
  getScoreComparisonClasses,
  getFinalScoreDisplay,
  getCardColorStyle,
  // generateStandingsHeaders, // Removed unused export
  generateTable // Export the new function
};

/**
 * Generates a table row with a single header cell spanning multiple columns.
 * @param {string} content - HTML content for the header cell.
 * @param {number} colspan - The number of columns to span.
 * @param {string} [className=''] - Optional CSS class(es) for the cell.
 * @param {string} [style=''] - Optional inline style(s) for the cell.
 * @returns {string} HTML string for a <tr> element.
 */
function generateSpanningHeaderRow(content, colspan, className = '', style = '') { // Keep style for potential overrides
    const combinedClassName = `${className} text-center`.trim(); // Default to text-center for spanning headers
    const headerCell = generateTableHeaderCell(content, combinedClassName, style);
    // Set colspan attribute on the generated th
    const cellWithColspan = headerCell.replace('<th ', `<th colspan="${colspan}" `);
    return `<tr>${cellWithColspan}</tr>`;
}

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

/**
 * Gets the CSS class name for a given card color.
 * @param {string|null} cardColor - The color name (e.g., 'yellow', 'red', 'black').
 * @returns {string} CSS class name (e.g., 'card-yellow', 'card-red', 'card-black').
 */
function getCardColorStyle(cardColor) {
    switch (cardColor?.toLowerCase()) {
        case 'yellow': return 'card-yellow';
        case 'red': return 'card-red';
        case 'black': return 'card-black';
        default: return '';
    }
}

/**
 * Generates a complete HTML table structure.
 * @param {Object} config - Configuration object.
 * @param {Array<Object>} config.data - Array of data objects for table rows.
 * @param {Array<{key: string, label: string, className?: string, style?: string}>} config.headersConfig - Configuration for table headers.
 * @param {function(Object): string} config.rowGenerator - Function that takes a data row object and returns HTML for a <tr>.
 * @param {string} [config.tableClassName=''] - Optional CSS class(es) for the <table> element.
 * @param {string} [config.tableStyle=''] - Optional inline style(s) for the <table> element.
 * @param {string} [config.colgroupHtml=''] - Optional HTML string for <colgroup>.
 * @param {string} [config.emptyDataMessage='No data available.'] - Message to display if data array is empty.
 * @returns {string} HTML string for a complete <table> element.
 */
function generateTable({
    data,
    headersConfig,
    rowGenerator,
    tableClassName = '',
    tableStyle = '',
    colgroupHtml = '',
    emptyDataMessage = 'No data available.'
}) {
    let html = `<table class="${tableClassName}" style="${tableStyle}">`;
    html += colgroupHtml;

    // Generate Header Row
    const headers = headersConfig.map(h => h.label);
    const headerConfigMap = headersConfig.reduce((acc, h) => {
        acc[h.label] = { className: h.className || '', style: h.style || '' };
        return acc;
    }, {});
    html += '<thead>';
    html += generateTableHeaderRow(headers, headerConfigMap);
    html += '</thead>';

    // Generate Body Rows
    html += '<tbody>';
    if (data && data.length > 0) {
        data.forEach(row => {
            html += rowGenerator(row);
        });
    } else {
        // Use a class for the empty message cell
        html += `<tr><td colspan="${headers.length}" class="empty-data-message">${emptyDataMessage}</td></tr>`;
    }
    html += '</tbody>';

    html += '</table>';
    return html;
}
