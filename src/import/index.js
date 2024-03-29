const fs = require('fs');
const yaml = require('js-yaml');
const { validateFixtures } = require('gcp-core');

const importFixtures = config => {
  try {
    const data = yaml.load(config);
    const issues = [];
    if (!validateFixtures(data, issues)) {
      issues.forEach(issue => console.log(issue))
      throw new Error('Invalid fixtures')
    }
    const inserts = generateFixturesImport(data);
    console.log(inserts)
  } catch (e) {
    console.error(e);
  }
}

// This function is used to generate the SQL insert statements for the fixtures
const generateFixturesImport = data => {
  const { tournamentId, startDate } = data
  const rows = [
    'DELETE FROM `EuroTourno`.`fixtures` WHERE `tournamentId` = ' + tournamentId + ';',
    ...data.schedule.fixtures.map(fixture => {
      const [,time, pitch, stage, category, group, team1, team2, umpireTeam] = fixture;
      return [
        "INSERT INTO `EuroTourno`.`fixtures` (",
        " `tournamentId`, `category`, `groupNumber`, `stage`, `pitch`, ",
        " `scheduled`, `started`, ",
        " `team1Planned`, `team1Id`, `goals1`, `points1`,",
        " `team2Planned`, `team2Id`, `goals2`, `points2`, ",
        " `umpireTeamPlanned`, `umpireTeamId` ",
        ") VALUES ( ",
        ` '${tournamentId}', '${category}', '${group}', '${stage}', '${pitch}', `,
        ` '${startDate} ${time}:00', NULL, `,
        ` '${team1}', '${team1}', NULL, NULL, `,
        ` '${team2}', '${team2}', NULL, NULL, `,
        ` '${umpireTeam}', '${umpireTeam}'`,
        ");"
      ].join('');
    })
  ];
  return rows.join('\n');
}

/*
INSERT INTO `EuroTourno`.`fixtures` ( `tournamentId`, `category`, `groupNumber`, `stage`, `pitch`, `scheduled`, `started`, `team1Planned`, `team1Id`, `goals1`, `points1`, `team2Planned`, `team2Id`, `goals2`, `points2`, `umpireTeamPlanned`, `umpireTeamId` ) VALUES ( '6', 'group', 'Mens', 'Pitch 5', '10:30',  '2024-03-23 1:00', NULL,  '1', '1', NULL, NULL,  'Amsterdam A', 'Amsterdam A', NULL, NULL,  'Leuven A', 'Leuven A');
INSERT INTO `EuroTourno`.`fixtures` ( `tournamentId`, `category`, `groupNumber`, `stage`, `pitch`, `scheduled`, `started`, `team1Planned`, `team1Id`, `goals1`, `points1`, `team2Planned`, `team2Id`, `goals2`, `points2`, `umpireTeamPlanned`, `umpireTeamId`)  VALUES ( '5', 'Ladies', '1', 'finals', 'Z1', '2023-03-02 14:00:00', NULL, '~Ladies_group1/p:1', '~Ladies_group1/p:1', NULL, NULL, '~Ladies_group1/p:2', '~Ladies_group1/p:2', NULL, NULL, '~Ladies_group1/p:2', '~Ladies_group1/p:2');
*/ 

module.exports = {
  importFixtures,
}
