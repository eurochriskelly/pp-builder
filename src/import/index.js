const fs = require('fs');
const yaml = require('js-yaml');
const { validateFixtures } = require('./validate');

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
  const rows = data.schedule.fixtures.map(fixture => {
    const [time, pitch, stage, category, group, team1, team2, umpireTeam] = fixture;
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
  });
  return rows.join('\n');
}

module.exports = {
  importFixtures,
}
