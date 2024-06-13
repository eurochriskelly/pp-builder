export const wrapRows = (rows: any[]) => {
  const keys = [
    'matchId', 'time', 'pitch', 'stage', 'category', 'group', 
    'team1', 'team2', 'umpireTeam', 'duration',
    'pool1', 'pool1Id', 'position1',
    'pool2', 'pool2Id', 'position2',
    'poolUmp', 'poolUmpId', 'positionUmp', 'categoryUmp',
  ];
  return wrap(keys, rows);
}

export const getScheduleProps = (fixtures: any[]) => {
  let data: any = {
    categories: [],
    pitches: [],
    groups: {
      all: [],
      byCategory: {}
    },
    teams: {
      all: [],
      byCategory: {}
    }
  }
 
  const pitches = new Set()
  const categories = new Set()
  const teams = new Set()
  const groups = new Set()

  fixtures.forEach(f => {
    categories.add(f.category);
    pitches.add(f.pitch);
    if (f.stage === 'group') {
      teams.add(`${f.category}/${f.group}/${f.team1}`);
      teams.add(`${f.category}/${f.group}/${f.team2}`);
      teams.add(`${f.category}/${f.group}/${f.umpireTeam}`);
      groups.add(`${f.category}/${f.group}`)
    }
  })

  data.categories = [...categories].sort();
  data.pitches = [...pitches].sort();
  data.teams.all = [...teams].sort();
  data.groups.all = [...groups].sort();

  // get teams by catetory
  data.categories.forEach((cat: string) => {
    const catTeams = new Set(); 
    const catGroups = new Set();
    fixtures.filter(f => f.category === cat && f.stage === 'group').forEach(f => {
      catTeams.add(f.group + '/' + f.team1);
      catTeams.add(f.group + '/' + f.team2);
      catGroups.add(f.group);
    })
    data.teams.byCategory[cat] = [...catTeams].sort();
    data.groups.byCategory[cat] = [...catGroups].sort();
  })

  return data
}


// helpers
function wrap(keys: string[], rows: any) {
  return rows.map((row: any[]) => {
    let wrappedRow: any = {};
    keys.forEach((key, index) => {
      wrappedRow[key] = row[index] !== undefined ? row[index] : null;
    });
    return wrappedRow;
  });
}
