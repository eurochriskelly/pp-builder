const { processTeamName, formatScore } = require('../../utils');
const { hashString } = require('./styleUtils');

// Helper class to represent score data
class ScoreData {
    constructor(goals, points, outcome = 'played') {
        this.goals = goals;
        this.points = points;
        this.outcome = outcome;
        this.total = goals || goals === 0 ? goals * 3 + points : null
    }

    toString() {
        return this.outcome == 'played'
         ? formatScore(this.goals, this.points)
         : (this.goals === 0 && this.points === 0) 
           ? 'SCRATCH' 
           : (this.goals === 0 && this.points === 0) ? 'WALKED' : 'INVALID'
    }

    // Add method to support custom HTML rendering
    toHTML() {
        return this.customHtml || this.toString();
    }
}

// Row class to manage individual table rows
class UtilRow {
    constructor() {
        this.fields = new Map();
        this.styles = new Map();
    }

    setFields(data) {
        Object.entries(data).forEach(([key, value]) => {
            this.setField(key, value);
        });
        return this;
    }

    setField(key, value) {
        this.fields.set(key, value);
        return this;
    }

    setStyle(key, styleObj) {
        this.styles.set(key, styleObj);
        return this;
    }

    addBorder(key, side, style = '1px solid #ccc') {
        const currentStyle = this.styles.get(key) || {};
        this.styles.set(key, {
            ...currentStyle,
            [`border-${side}`]: style
        });
        return this;
    }

    getField(key) {
        return this.fields.get(key);
    }

    getStyle(key) {
        return this.styles.get(key) || {};
    }

    // Add methods for raw data
    setRawData(data) {
        this.rawData = data;
        return this;
    }

    getRawData() {
        return this.rawData;
    }
}

// Main table utility class
class UtilTable {
    constructor(options = {}) {
        this.headers = new Map();
        this.rows = [];
        this.tableClassName = options.tableClassName || '';
        this.tableStyle = options.tableStyle || '';
        this.emptyMessage = options.emptyMessage || 'No data available.';
        this.showHeader = true;
        this.fullHeaders = [];
    }

    noHeader() {
      this.showHeader = false;
      return this;
    }

    fullHeader(text, options = {}) {
        this.fullHeaders.push({
            text,
            position: options.position || 'before', // 'before' or 'after' a row
            rowIndex: options.rowIndex || this.rows.length
        });
        return this;
    }
    addHeaders(headerConfig) {
        Object.entries(headerConfig).forEach(([key, config]) => {
            const obj = {
                label: config.label || key,
                width: config.width || 'auto',
                align: config.align || 'left',
                style: config.style || {},
                className: `text-${config.align || 'left'}`
            }
            this.headers.set(key, obj);
        });
        return this;
    }

    addRow(row) {
        if (!(row instanceof UtilRow)) {
            throw new Error('Row must be an instance of UtilRow');
        }
        this.rows.push(row);
        return this;
    }

    // Reverted: Does not accept row object anymore
    generateCell(content, headerKey) {
        const header = this.headers.get(headerKey) || {};
        const style = {};
        // Removed spacerHtml logic
        let className = header.className || '';
        let cellContent = (content === null || content === undefined) ? 'N/A' : content;

        // Special handling for logo column
        if (headerKey === 'teamLogo') {
            cellContent = content === null || content === undefined ? '' : content;
            return `<td class="${className.trim()}" style="padding: 2px; width: 40px; min-width: 40px; height: 40px; min-height: 40px; box-sizing: border-box">
                        ${cellContent}
                    </td>`;
        }

        // Regular column styling
        style.width = header.width;
        style['text-align'] = header.align;
        cellContent = (content === null || content === undefined) ? 'N/A' : content;

        // Special handling based on field type
        if (headerKey === 'id') {
            cellContent = content ? String(content).slice(-3) : 'N/A';
            className += ' id-column';
        } else if (headerKey.includes('team')) {
            if (typeof content === 'string') {
                const { teamName, isScratched } = processTeamName(content);
                cellContent = teamName;
                let teamClass = content === 'TBD' ? 'team-tbd' : `team-${hashString(content)}`;
                
                if (isScratched) {
                    className += ' scratched-team';
                    cellContent += ' (S)';
                } else if (content.toLowerCase().includes('walked')) {
                    className += ' walked-team';
                    cellContent += ' (W)';
                }
                
                className += ` ${teamClass}`;
            } else {
                cellContent = 'N/A';
                className += ' text-grey';
            }
        } else if (headerKey.includes('score')) {
            // Check if content has custom HTML
            if (content instanceof ScoreData && content.customHtml) {
                cellContent = content.customHtml;
            } else {
                cellContent = content instanceof ScoreData ? content.toString() : formatScore(null, null);

                if (typeof content === 'string') {
                    const lowerContent = content.toLowerCase();
                    if (lowerContent.includes('walked')) {
                        className += ' walked-score';
                    } else if (lowerContent.includes('concede')) {
                        className += ' conceded-score';
                    } else if (lowerContent.includes('shared')) {
                        className += ' shared-score';
                    }
                }

                className += content === 'N/A' ? ' text-grey' : '';
            }

        }

        const styleStr = Object.entries(style)
            .map(([k, v]) => `${k}: ${v}`)
            .join('; ');

        // Only remove borders if they're not explicitly set
        const borderLeft = style['border-left'] ? '' : 'border-left: none;';
        const borderRight = style['border-right'] ? '' : 'border-right: none;';
        // Reverted: Removed spacerHtml
        return `<td class="${className.trim()}" style="${styleStr}; ${borderLeft} ${borderRight}">${cellContent}</td>`;
    }

    toHTML() {
        let html = `<table class="util-table ${this.tableClassName}" style="${this.tableStyle}; border-collapse: collapse; border-spacing: 0; border-left: none; border-right: none;">`;
        
        // Removed pre-processing of 'before' headers here.

        // Generate headers
        if (this.showHeader) {
            html += '<thead><tr>';
            for (const [key, header] of this.headers) {
                // Build style string from all header properties that should be applied to style
                let styleStr = `width: ${header.width}; text-align: ${header.align}`;

                // Apply all custom style properties from config.style
                if (header.style) {
                    for (const [styleProp, styleValue] of Object.entries(header.style)) {
                        // Skip properties that aren't CSS styles
                        if (styleProp !== 'className' && styleProp !== 'label' && styleProp !== 'width' && styleProp !== 'align') {
                            styleStr += `; ${styleProp}: ${styleValue}`;
                        }
                    }
                }

                // Default border handling if not explicitly set
                if (!header.style?.['border-left']) styleStr += '; border-left: none';
                if (!header.style?.['border-right']) styleStr += '; border-right: none';

                // Add specific styles for standings table headers
                if (key === 'TotalPoints') {
                    styleStr += ` font-weight: bold; border-left: 1px solid #ccc;`;
                } else if (key === 'PointsFrom') {
                    styleStr += ` border-left: 1px solid #ccc;`;
                }
                // Concatenate additional styles with camelCase to kebab-case conversion
                if (header.style) {
                    Object.entries(header.style).forEach(([styleKey, styleValue]) => {
                        const kebabKey = styleKey.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
                        styleStr += `; ${kebabKey}: ${styleValue}`;
                    });
                }

                html += `<th class="${header.className} xx" style="${styleStr}">${header.label}</th>`;
            }
            html += '</tr></thead>';
        }

        // Generate body
        html += '<tbody>';
        if (this.rows.length === 0) {
            html += `<tr><td colspan="${this.headers.size}" class="empty-data-message">${this.emptyMessage}</td></tr>`;
        } else {
            for (let i = 0; i < this.rows.length; i++) {
                // Check for and add 'before' headers for this row index
                const beforeHeaders = this.fullHeaders.filter(h => 
                    h.position === 'before' && h.rowIndex === i
                );
                for (const header of beforeHeaders) {
                    html += `<tr class="full-header-row">
                        <td colspan="${this.headers.size}" style="background-color: #f0f0f0; color: #333; text-align: center; text-transform: uppercase; font-weight: bold; padding: 8px; border-bottom: 1px solid #ddd;">
                            ${header.text}
                        </td>
                    </tr>`;
                }

                const row = this.rows[i];
                const rawData = row.getRawData();
                let dataAttribute = '';
                let rowClass = '';

                if (rawData) {
                    try {
                        // Stringify and escape for HTML attribute
                        const jsonString = JSON.stringify(rawData);
                        const escapedJson = jsonString.replace(/"/g, '&quot;');
                        dataAttribute = ` data-fixture="${escapedJson}"`;
                        rowClass = ' clickable-row'; // Add class for clickable rows
                    } catch (e) {
                        console.error("Error stringifying row data:", e, rawData);
                    }
                }

                html += `<tr class="${rowClass}" ${dataAttribute}>`; // Add class and data attribute
                for (const headerKey of this.headers.keys()) {
                    const content = row.getField(headerKey);
                    const cellStyle = row.getStyle(headerKey);
                    // Reverted: Pass only content and headerKey
                    const baseCell = this.generateCell(content, headerKey);

                    // Apply custom styles if they exist
                    if (Object.keys(cellStyle).length > 0) {
                        const styleStr = Object.entries(cellStyle)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join('; ');
                        html += baseCell.replace('style="', `style="${styleStr}; `);
                    } else {
                        html += baseCell;
                    }
                }
                html += '</tr>';
                
                // Add full headers that should appear after this row
                const postHeaders = this.fullHeaders.filter(h => 
                    h.position === 'after' && h.rowIndex === i
                );
                for (const header of postHeaders) {
                    html += `<tr class="full-header-row">
                        <td colspan="${this.headers.size}" style="background-color: #f0f0f0; color: #333; text-align: center; text-transform: uppercase; font-weight: bold; padding: 8px; border-top: 1px solid #ddd; border-bottom: 1px solid #ddd;">
                            ${header.text}
                        </td>
                    </tr>`;
                }
            }
        }
        html += '</tbody></table>';

        return html;
    }
}

module.exports = { UtilTable, UtilRow, ScoreData };
