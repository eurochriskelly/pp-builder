const { processTeamName, formatScore } = require('../../utils');
const { hashString } = require('./styleUtils');

// Helper class to represent score data
class ScoreData {
    constructor(goals, points, outcome = 'played') {
        this.goals = goals;
        this.points = points;
        this.outcome = outcome;
    }
    toString() {
        return this.outcome == 'played'
         ? formatScore(this.goals, this.points)
         : (this.goals === 0 && this.points === 0) 
           ? 'SCRATCH' 
           : (this.goals === 0 && this.points === 0) ? 'WALKED' : 'INVALID'
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

    getField(key) {
        return this.fields.get(key);
    }

    getStyle(key) {
        return this.styles.get(key) || {};
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
    }

    addHeaders(headerConfig) {
        Object.entries(headerConfig).forEach(([key, config]) => {
            this.headers.set(key, {
                label: config.label || key,
                width: config.width || 'auto',
                align: config.align || 'left',
                className: `text-${config.align || 'left'}`
            });
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

    generateCell(content, headerKey) {
        const header = this.headers.get(headerKey) || {};
        const style = {};
        
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

        const styleStr = Object.entries(style)
            .map(([k, v]) => `${k}: ${v}`)
            .join('; ');

        return `<td class="${className.trim()}" style="${styleStr}">${cellContent}</td>`;
    }

    toHTML() {
        let html = `<table class="util-table ${this.tableClassName}" style="${this.tableStyle}">`;

        // Generate headers
        html += '<thead><tr>';
        for (const [key, header] of this.headers) {
            const styleStr = `width: ${header.width}; text-align: ${header.align}`;
            html += `<th class="${header.className}" style="${styleStr}">${header.label}</th>`;
        }
        html += '</tr></thead>';

        // Generate body
        html += '<tbody>';
        if (this.rows.length === 0) {
            html += `<tr><td colspan="${this.headers.size}" class="empty-data-message">${this.emptyMessage}</td></tr>`;
        } else {
            for (const row of this.rows) {
                html += '<tr>';
                for (const headerKey of this.headers.keys()) {
                    const content = row.getField(headerKey);
                    console.log('c, hk', headerKey, content)
                    const cellStyle = row.getStyle(headerKey);
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
            }
        }
        html += '</tbody></table>';

        return html;
    }
}

module.exports = { UtilTable, UtilRow, ScoreData };
