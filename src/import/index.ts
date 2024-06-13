import yaml from 'js-yaml';


import { validation } from 'gcp-core';

const { validateFixtures }  = validation // require('gcp-core/cjs').validation;

const validateFixtures2 = (rows: any) => {
  /**
    Validate that genearte umpire teams relate to an actual fixutre
    e.g. ~match:12314/p:1&Ladies must have a fixture 12314 and category Ladies
   */
}

// Import fixtures from a yaml file and load into a JSON object
export const importFixtures = (config: string) => {
  console.log('Importing fixtures')
  try {
    const data = yaml.load(config);
    const issues: string[] = [];
    if (!validateFixtures(data, issues)) {
      issues.forEach(issue => console.log(issue))
      throw new Error('Invalid fixtures')
    }
    const inserts = generateFixturesImport(data);
  } catch (e) {
    console.error(e);
  }
}

export const importFixturesCsv = (
  csv: string,
  tournamentId: string,
  startDate: string,
  title: string,
  location: string
) => {
  const rows = csv.split('\n').map(row => row.split(','));
  const dataIn: any = {
    tournamentId: +tournamentId,
    startDate,
    title,
    location,
    activities: rows
  }
  const { properties, sql} = generateFixturesImport(dataIn);
  Object.keys(properties).forEach((prop: string) => {
    console.log(`${prop}:`);
    properties[prop].forEach((p: string) => console.log(`  ${p}`));
  })
  return sql 
}

// if team is in form ~match:nnn/p:m, update teh value of nnn to include tourmanet
const fixMatchIds = (team: string, add: number) => {
  if (!team.startsWith('~match:')) return team
  const newval = team.replace(/(~match:)(\d+)/, (_, p1, p2) => {
    return p1 + (parseInt(p2) + add);
  })
  console.log(`Change from [${team}] to [${newval}]`);
  return newval
}

const concatIfTilda = (
  team: string, 
  colName: number, colGroup: number, colPosition: number, colCategory: (number|null),
  fixture: any
) => {
  if (team !== '~') return team;
  const name = fixture[colName];
  const group = fixture[colGroup];
  const position = fixture[colPosition];
  const category = (colCategory && fixture[colCategory]) ? `&${fixture[colCategory]}` : ''
  return `~${name}:${group}/p:${position}${category}`;
}

// This function is used to generate the SQL insert statements for the fixtures
const generateFixturesImport = (data: any) => {
 const dataRows = data.activities
      .filter((row: any) => row[0] !== 'matchId') // remove header ow if it exists
      .filter((row: any) => !!(row[0]).trim())
  const { tournamentId, startDate, title, location } = data
  const tOffset = +tournamentId * 10000; // add 1000 x tournament id to ensure uniqueness
  // Find unique list of values
  const pitches = new Set()
  const categories = new Set()
  const teams = new Set()
  dataRows.forEach((fixture: any) => {
    const [,,pitch,stage,category,,team1,team2,umpire] = fixture;
    categories.add(category);
    pitches.add(pitch);
    if (stage === 'group') {
      // build a list of unique teams
      teams.add(team1);
      teams.add(team2);
      teams.add(umpire);
    }
  });
  const insertPitch = (p: string) => {
    // Ensure pitches exist
    return [
      'INSERT INTO `EuroTourno`.`pitches` (pitch, location, type, tournamentId)',
      `VALUES ('${p}', '${location.substring(0, 10)}', 'grass', ${tournamentId})`,
      'ON DUPLICATE KEY UPDATE',
      '  pitch = VALUES(pitch),',
      '  location = VALUES(location),',
      '  type = VALUES(type),',
      '  tournamentId = VALUES(tournamentId);'
    ].join(' ')
  }
  const p = [...pitches].map((p: any) => insertPitch(p));
  const rows = [
    `-- CREATED AT TIME: ${new Date().toISOString()}`,
    'DELETE FROM `EuroTourno`.`fixtures` WHERE `tournamentId` = ' + tournamentId + ';',
    'DELETE FROM `EuroTourno`.`pitches` WHERE `tournamentId` = ' + tournamentId + ';',
    // Ensure the tournament exists
    'INSERT INTO `EuroTourno`.`tournaments` (id, Date, Title, Location, Lat, Lon)',
    `VALUES (${tournamentId}, '${startDate}', '${title}', '${location}', 52.2942, 4.842)`,
    'ON DUPLICATE KEY UPDATE',
    ' Date = VALUES(Date), Title = VALUES(Title), Location = VALUES(Location), Lat = VALUES(Lat), Lon = VALUES(Lon);',
    '-- Update pitches',
    ...p,
    '-- Update fixtures',
    ...dataRows.map((fixture: any) => {
      const [id, time, pitch, stage, category, group, team1, team2, umpireTeam] = fixture;
      const cOffset = [...categories].indexOf(category) * 1000;
      const offset = tOffset + cOffset;
      const useTeam1 = fixMatchIds(concatIfTilda(team1, 10,11,12, null, fixture), offset);
      const useTeam2 = fixMatchIds(concatIfTilda(team2, 13,14,15, null, fixture), offset);
      const useUmpireTeam = fixMatchIds(concatIfTilda(umpireTeam, 16, 17, 18, 19, fixture), offset);
      return [
        "INSERT INTO `EuroTourno`.`fixtures` (",
        " `id`, `tournamentId`, `category`, `groupNumber`, `stage`, `pitch`, ",
        " `scheduled`, `started`, ",
        " `team1Planned`, `team1Id`, `goals1`, `points1`,",
        " `team2Planned`, `team2Id`, `goals2`, `points2`, ",
        " `umpireTeamPlanned`, `umpireTeamId` ",
        ") VALUES ( ",
        ` '${offset + parseInt(id)}', '${tournamentId}', '${category}', '${parseInt(group)}', '${stage}', '${pitch}', `,
        ` '${startDate} ${time}:00', NULL, `,
        ` '${useTeam1}', '${useTeam1}', NULL, NULL, `,
        ` '${useTeam2}', '${useTeam2}', NULL, NULL, `,
        ` '${useUmpireTeam}', '${useUmpireTeam}'`,
        ");"
      ].join('');
    })
  ];
  const result: any = {
    properties: {
      pitches: [...pitches].sort(),
      categories: [...categories].sort(),
      teams: [...teams].sort(),
    },
    sql: rows.join('\n')
  }
  return result;
}

