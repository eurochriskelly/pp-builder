const { generateTable, generateSpanningHeaderRow } = require('./tableUtils');

/**
 * Groups an array of items by a specified property
 * @param {Array} items - The items to group
 * @param {string} prop - The property to group by
 * @param {string} [defaultGroup='Unknown'] - Default group name for items without the property
 * @returns {Object} - Grouped items {group1: [items], group2: [items]}
 */
function groupBy(items, prop, defaultGroup = 'Unknown') {
    return items.reduce((acc, item) => {
        const group = item[prop] || defaultGroup;
        if (!acc[group]) {
            acc[group] = [];
        }
        acc[group].push(item);
        return acc;
    }, {});
}

/**
 * Generates HTML for a grouped table view
 * @param {Object} groups - The grouped items from groupBy()
 * @param {function} rowGenerator - Function that generates HTML for a single row
 * @param {Array} headersConfig - Table headers configuration
 * @param {string} groupTitleFormatter - Function that formats group titles
 * @param {string} [emptyMessage='No data'] - Message to show when no groups
 * @returns {string} - Generated HTML
 */
function generateGroupedTables(groups, rowGenerator, headersConfig, groupTitleFormatter, emptyMessage = 'No data') {
    let html = '';
    const groupNames = Object.keys(groups);
    
    if (groupNames.length === 0) {
        return `<p>${emptyMessage}</p>`;
    }

    groupNames.forEach(group => {
        const groupTitle = groupTitleFormatter ? groupTitleFormatter(group) : group;
        html += generateSpanningHeaderRow(groupTitle, headersConfig.length, 'bg-group-header');
        html += generateTable({
            data: groups[group],
            headersConfig,
            rowGenerator,
            emptyDataMessage: `No items in ${group}`
        });
    });

    return html;
}

module.exports = {
    groupBy,
    generateGroupedTables
};
