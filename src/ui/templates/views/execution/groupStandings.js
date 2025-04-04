const { UtilTable, UtilRow } = require('../../partials/tableUtils');
const { processTeamName, generateTeamLabel } = require('../../../utils');

function createStandingsTable(groupData) {
    const table = new UtilTable({
        tableClassName: 'standings-table table-layout-fixed',
        emptyMessage: `No standings available for Group ${groupData.groupName}.`
    });

    // Add fixed headers
    table.addHeaders({
        team: { label: 'Team', align: 'left', width: 'auto' },
        teamLogo: { label: '', align: 'center', width: '5%' }
    });

    // First add all vs columns at once
    const vsHeaders = {};
    groupData.rows.forEach((row, i) => {
        const label = generateTeamLabel(row.team);
        vsHeaders[`vs${i}`] = {
            label: `<span>${label}</span>`,
            align: 'center',
            width: '6%'
        };
    });
    table.addHeaders(vsHeaders);

    // Add stats columns
    table.addHeaders({
        MatchesPlayed: { label: 'P', align: 'center', width: '3%' },
        Wins: { label: 'W', align: 'center', width: '3%' },
        Draws: { label: 'D', align: 'center', width: '3%' },
        Losses: { label: 'L', align: 'center', width: '3%' },
        PointsFrom: { label: 'SF', align: 'center', width: '4%' },
        PointsDifference: { label: 'SD', align: 'center', width: '4%' },
        TotalPoints: { label: 'Pts', align: 'center', width: '4%' }
    });

    // Add rows
    groupData.rows.forEach((row, rowIndex) => {
        const { teamName, teamStyle } = processTeamName(row.team);
        const teamLabel = generateTeamLabel(row.team);
        
        const utilRow = new UtilRow()
            .setFields({
                team: row.team,
                teamLogo: `<logo-box title="${row.team}" index="${rowIndex}" size="30px"></logo-box>`,
                ...row
            })
            .setStyle('team', { 
                'font-weight': 'bold',
                'text-transform': 'uppercase',
                ...teamStyle
            });

        // Add vs columns - we need to ensure all vs columns exist for each row
        groupData.rows.forEach((_, colIndex) => {
            const fieldName = `vs${colIndex}`;
            if (colIndex === rowIndex) {
                utilRow.setField(fieldName, '&nbsp;')
                    .setStyle(fieldName, {
                        'width': '60px',
                        'max-width': '60px',
                        'height': '30px',
                        'background-color': '#999',
                        'padding': '0'
                    });
            } else {
                utilRow.setField(fieldName, '');
            }
        });

        table.addRow(utilRow);
    });

    return table;
}

module.exports = function generateGroupStandings(data) {
    let html = '<div id="group-standings" class="text-center w-full mx-auto">';

    // Handle case where data is undefined or empty
    if (!data || Object.keys(data).length === 0) {
        return '<div id="group-standings"><p>No group standings data available.</p></div>';
    }

    for (const cat of Object.keys(data)) {
        for (const groupData of data[cat]) {
            // Sort rows (keep sorting logic here)
            groupData.rows.sort((a, b) => {
                if (b.TotalPoints !== a.TotalPoints) return b.TotalPoints - a.TotalPoints;
                if (b.PointsDifference !== a.PointsDifference) return b.PointsDifference - a.PointsDifference;
                if (b.PointsFrom !== a.PointsFrom) return b.PointsFrom - a.PointsFrom;
                return 0;
            });

            // Skip if no rows data
            if (!groupData.rows || !groupData.rows.length) {
                html += `<p>No standings data available for Group ${groupData.groupName}</p>`;
                continue;
            }

            // Add group header
            html += `<h3 class="group-header uppercase text-center font-bold text-xl my-4">GROUP ${groupData.groupName.toUpperCase()}</h3>`;
            
            // Generate and add table
            const table = createStandingsTable(groupData);
            html += table.toHTML();
        }
    }

    if (Object.keys(data).length === 0) {
        html += '<p>No group standings available.</p>';
    }

    html += `
        <style>
            .logo-cell {
                padding: 2px !important;
                width: 40px;
                height: 40px;
                min-width: 40px;
                min-height: 40px;
            }
            .logo-cell logo-box {
                display: block;
                width: 100%;
                height: 100%;
            }
        </style>
    </div>`;
    return html;
};
