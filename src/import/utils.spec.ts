import { getScheduleProps, wrapRows } from './utils';

describe('Utility functions', () => {
  it('wraps rows into nice object', () => {
    const rows = [
      [
        1, '2:12', 'Pitch 1', 'group', 'Mens', 1, 
        'Team X', 'Team Y', 'Team Z',
      ],
      [
        3, '2:12', 'Pitch 1', 'group', 'Mens', 1, 
        'Team X', 'Team Y', 'Umpers',
      ] 
    ]
    const obj = wrapRows(rows)
    expect(obj[1].umpireTeam).toBe('Umpers')
  })
  it.only('extracts properties from data', () => {
    const props = getScheduleProps(testData().sched1);
    expect(props.categories.length).toBe(2);
    expect(props.pitches.length).toBe(4);
    expect(props.groups.all.length).toBe(3);
    expect(props.teams.all.length).toBe(11);
    expect(props.teams.byCategory['Mens'].length).toBe(8);
    expect(props.groups.all.length).toBe(3);
    expect(props.groups.byCategory['Mens'].length).toBe(2);
  })
})

function testData() {
  return {
    sched1: wrapRows([
      [ 1, '2:12', 'Pitch 1', 'group', 'Mens', 1, 'Team X', 'Team Y', 'Team Z' ],
      [ 2, '2:12', 'Pitch 2', 'group', 'Mens', 1, 'Team A', 'Team B', 'Team Y' ],
      [ 3, '2:12', 'Pitch 1', 'group', 'Mens', 1, 'Team X', 'Team A', 'Team B' ],
      [ 4, '2:12', 'Pitch 2', 'group', 'Mens', 1, 'Team Y', 'Team B', 'Team X' ],
      [ 5, '2:12', 'Pitch 3', 'group', 'Mens', 1, 'Team A', 'Team Y', 'Team B' ],
      [ 6, '2:12', 'Pitch 2', 'group', 'Mens', 1, 'Team X', 'Team B', 'Team Y' ],
      [ 7, '2:12', 'Pitch 4', 'group', 'Mens', 2, 'Team A', 'Team B', 'Team C' ],
      [ 8, '2:12', 'Pitch 4', 'group', 'Mens', 2, 'Team A', 'Team C', 'Team B' ],
      [ 9, '2:12', 'Pitch 4', 'group', 'Mens', 2, 'Team B', 'Team C', 'Team A' ],
      [ 3, '2:12', 'Pitch 3', 'group', 'Ladies', 1, 'Team X', 'Team Y', 'Umpers' ],
    ])
  }
}
