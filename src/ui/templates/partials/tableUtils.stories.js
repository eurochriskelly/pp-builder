const { UtilTable, UtilRow, ScoreData } = require('./tableUtils');
const { processTeamName } = require('../../utils');

export default {
  title: 'Components/Table',
  parameters: {
    layout: 'padded',
  },
};

// Basic table with simple data
export const BasicTable = {
  render: () => {
    const table = new UtilTable({
      tableClassName: 'basic-table',
      emptyMessage: 'No data available'
    }).addHeaders({
      id: { label: 'ID', width: '50px', align: 'center' },
      name: { label: 'Name', width: '200px', align: 'left' },
      score: { label: 'Score', width: '100px', align: 'center' }
    });

    table.addRow(new UtilRow()
      .setFields({
        id: 12345,
        name: 'Team A', 
        score: new ScoreData(2, 5)
      })
      .addBorder('name', 'left')
      .addBorder('score', 'right', '2px solid #999')
    );

    table.addRow(new UtilRow().setFields({
      id: 67890,
      name: 'Team B',
      score: new ScoreData(1, 8)
    }));

    return table.toHTML();
  }
};

// Table with special scores
export const SpecialScores = {
  render: () => {
    const table = new UtilTable({
      tableClassName: 'special-scores-table'
    }).addHeaders({
      team: { label: 'Team', width: '150px' },
      result: { label: 'Result', width: '100px', align: 'center' }
    });

    table.addRow(new UtilRow().setFields({
      team: 'Walkover Team',
      result: 'WALKED'
    }));

    table.addRow(new UtilRow().setFields({
      team: 'Conceding Team',
      result: 'CONCEDED'
    }));

    table.addRow(new UtilRow().setFields({
      team: 'Shared Points Team',
      result: 'SHARED'
    }));

    return table.toHTML();
  }
};

// Table with team name processing
export const TeamNameProcessing = {
  render: () => {
    const table = new UtilTable({
      tableClassName: 'team-names-table'
    }).addHeaders({
      original: { label: 'Original Name', width: '200px' },
      processed: { label: 'Processed Name', width: '200px' }
    });

    const testNames = [
      'Team A/B',
      'Scratched Team (S)',
      'Walked Team (W)',
      'Long Team Name With Numbers 123'
    ];

    testNames.forEach(name => {
      table.addRow(new UtilRow().setFields({
        original: name,
        processed: processTeamName(name).teamName
      }));
    });

    return table.toHTML();
  }
};

// Table with full headers
export const TableWithFullHeaders = {
  render: () => {
    const table = new UtilTable({
      tableClassName: 'full-headers-table'
    }).addHeaders({
      team: { label: 'Team', width: '200px' },
      played: { label: 'Played', width: '80px', align: 'center' },
      points: { label: 'Points', width: '80px', align: 'center' }
    });

    // Header before any rows
    table.fullHeader('Group A');

    table.addRow(new UtilRow().setFields({
      team: 'Team Alpha',
      played: 5,
      points: 12
    }));

    table.addRow(new UtilRow().setFields({
      team: 'Team Beta',
      played: 5,
      points: 10
    }));

    // Header after specific row
    table.fullHeader('Group B', { position: 'after', rowIndex: 1 });

    table.addRow(new UtilRow().setFields({
      team: 'Team Gamma',
      played: 4,
      points: 8
    }));

    table.addRow(new UtilRow().setFields({
      team: 'Team Delta',
      played: 4,
      points: 6
    }));

    return table.toHTML();
  }
};

// Empty table state
export const EmptyTable = {
  render: () => {
    return new UtilTable({
      emptyMessage: 'No matches scheduled yet'
    }).addHeaders({
      date: { label: 'Date' },
      match: { label: 'Match' },
      venue: { label: 'Venue' }
    }).toHTML();
  }
};
