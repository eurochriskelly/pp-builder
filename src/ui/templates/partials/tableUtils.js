const { processTeamName, formatScore } = require('../../utils');
const { hashString } = require('./styleUtils');

/**
 * Generates a generic table cell (<td>).
 * @param {string|number|null} content - The content for the cell.
 * @param {string} [className=''] - Optional CSS class(es) for the cell.
 * @param {string} [style=''] - Optional inline style(s) for the cell.
 * @param {string} [style=''] - Optional inline style(s) for the cell.
 * @returns {string} HTML string for a <td> element.
 */
function generateTableCell(content, className = '', style = '') {
  const combinedClassName = className || '';
  let cellStyle = style || '';

  // Apply fixed width style if it's a centered (non-team) column
  if (className.includes('text-center')) {
      cellStyle += ' width: 30px; max-width: 30px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;';
  }

  return `<td class="${combinedClassName}" style="${cellStyle.trim()}">${content ?? 'N/A'}</td>`;
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
  const { teamName } = processTeamName(team);
  const teamClass = team === 'TBD' ? 'team-tbd' : `team-${hashString(team)}`;
  return generateTableCell(teamName, `${className} ${teamClass}`.trim());
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
    let cellStyle = style || '';
    
    // Apply vertical style if needed
    if (className.includes('vertical-text')) {
        cellStyle += ' writing-mode: vertical-rl; transform: rotate(180deg); white-space: nowrap; padding: 4px 2px;';
    }
    
    // Apply fixed width style if it's a centered (non-team) column
    if (className.includes('text-center')) {
        cellStyle += ' width: 30px; max-width: 30px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;';
    }
    
    return `<th class="${combinedClassName}" style="${cellStyle.trim()}">${content}</th>`;
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

/**
 * Generates a table row with a single header cell spanning multiple columns.
 * @param {string} content - HTML content for the header cell.
 * @param {number} colspan - The number of columns to span.
 * @param {string} [className=''] - Optional CSS class(es) for the cell.
 * @param {string} [style=''] - Optional inline style(s) for the cell.
 * @returns {string} HTML string for a <tr> element.
 */
function generateSpanningHeaderRow(content, colspan, className = '', style = '') {
    // Ensure spanning headers are always horizontal
    const combinedClassName = `${className.replace('vertical-text', '')} text-center`.trim();
    const headerCell = generateTableHeaderCell(content, combinedClassName, style);
    // Set colspan attribute on the generated th
    const cellWithColspan = headerCell.replace('<th ', `<th colspan="${colspan}" `);
    return `<tr>${cellWithColspan}</tr>`;
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

module.exports = {
  generateTableCell,
  generateIdCell,
  generateTeamCell,
  generateScoreCell,
  generateTableHeaderCell,
  generateTableHeaderRow,
  generateSpanningHeaderRow,
  generateTable
};
