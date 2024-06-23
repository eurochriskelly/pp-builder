import { wrapRows, getScheduleProps } from './utils';
import { validateFixtures } from './validate';
import { generateClubInsertStatement, generateTeamInsertStatement } from './club-update';

export const importClubsCsv = (
  csv: string
) => {
  const sqlInserts : string[] = [
    `DELETE * FROM clubs`,
    `DELETE * FROM clubTeams`,
  ];
  const rows = csv.split('\n').map(row => row.split(','));
  rows.slice(1, 3).forEach(r => {
    const [
      id, student, clubName,
      yearFounded, yearAffiliated, yearDissolved,
      countryCode, city, region, subregion, status,
      teamGAA, teamLGFA, teamHurling, teamCamogie, teamHandball, teamRounders, teamYouthFootball, teamYouthHurling,
      domain ] = r
    const teams: any = {
      teamGAA, teamLGFA, teamHurling, teamCamogie, teamHandball, teamRounders, teamYouthFootball, teamYouthHurling,
    }
    console.log(teams)
    sqlInserts.push(generateClubInsertStatement({
      clubId: +id, 
      isStudent: student.toLowerCase() === 'yes',
      clubName, 
      founded: +yearFounded, 
      affiliated: yearAffiliated ? +yearAffiliated : +yearFounded,
      deactivated: yearDissolved ? +yearDissolved : null,
      country: countryCode,
      city, 
      region, 
      subregion: subregion|| null,
      status,
      domain
    }));
    Object.keys(teams).forEach((team: any) => {
      if (teams[team] && +teams[team] > 0) {
        sqlInserts.push(generateTeamInsertStatement({
          clubId: id,
          teamName: 'Senior Team',
          category: 'gaa',
          foundedYear: 1971,
          status: 'active',
          contactEmail: 'contact@example.com'
        }))
      }
    })
  })
  console.log(sqlInserts.join('\n'));
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
  const { fixtures, sql} = generateFixturesImport(dataIn);
  const { isValid, warnings } = validateFixtures(fixtures);
  if (isValid) {
    return sql;
  } else {
    console.log(`ERROR: Validation failed with the the following issues:`);
    warnings.forEach(warn => {
      console.log(`  ${warn}`);
    })
  }
}

// if team is in form ~match:nnn/p:m, update teh value of nnn to include tourmanet
const fixMatchIds = (team: string, add: number) => {
  if (!team.startsWith('~match:')) return team
  return team.replace(/(~match:)(\d+)/, (_, p1, p2) => {
    return p1 + (parseInt(p2) + add);
  })
}

const concatIfTilda = (
  team: string, 
  colName: string, colGroup: string, colPosition: string, colCategory: (string|null),
  fixture: any
) => {
  if (team !== '~') return team;
  const name = fixture[colName].trim()
  const group = parseInt(fixture[colGroup.trim()]);
  const position = parseInt(fixture[colPosition.trim()]);
  const category = (colCategory && fixture[colCategory]) ? `&${fixture[colCategory.trim()]}` : ''
  return `~${name}:${group}/p:${position}${category}`;
}

// This function is used to generate the SQL insert statements for the fixtures
const generateFixturesImport = (data: any) => {
  const dataRows = wrapRows(data.activities
    .filter((row: any) => row[0] !== 'matchId') // remove header ow if it exists
    .filter((row: any) => !!(row[0]).trim())
  )
  const { tournamentId, startDate, title, location } = data
  const tOffset = +tournamentId * 10000; // add 1000 x tournament id to ensure uniqueness
  const { pitches, categories, teams, groups }= getScheduleProps(dataRows);
  // Find unique list of values
  const insertPitch = (p: string) => {
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
  const p = pitches.map((p: any) => insertPitch(p));
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
      const {matchId, time, pitch, stage, category, group, team1, team2, umpireTeam} = fixture;
      const cOffset = categories.indexOf(category) * 1000;
      const offset = tOffset + cOffset;
      const useTeam1 = fixMatchIds(concatIfTilda(team1, 'pool1', 'pool1Id', 'position1', null, fixture), offset);
      const useTeam2 = fixMatchIds(concatIfTilda(team2, 'pool2', 'pool2Id', 'position2', null, fixture), offset);
      const useUmpireTeam = fixMatchIds(concatIfTilda(umpireTeam, 'poolUmp', 'poolUmpId', 'positionUmp', 'categoryUmp', fixture), offset);
      fixture.team1 = useTeam1
      fixture.team2 = useTeam2
      fixture.umpireTeam = useUmpireTeam
      fixture.matchId = offset + parseInt(matchId)
      fixture.group = +fixture.group
      fixture.duration = +fixture.duration
      return [
        "INSERT INTO `EuroTourno`.`fixtures` (",
        " `id`, `tournamentId`, `category`, `groupNumber`, `stage`, `pitch`, ",
        " `scheduled`, `started`, ",
        " `team1Planned`, `team1Id`, `goals1`, `points1`,",
        " `team2Planned`, `team2Id`, `goals2`, `points2`, ",
        " `umpireTeamPlanned`, `umpireTeamId` ",
        ") VALUES ( ",
        ` '${fixture.matchId}', '${tournamentId}', '${category}', '${parseInt(group)}', '${stage}', '${pitch}', `,
        ` '${startDate} ${time}:00', NULL, `,
        ` '${useTeam1}', '${useTeam1}', NULL, NULL, `,
        ` '${useTeam2}', '${useTeam2}', NULL, NULL, `,
        ` '${useUmpireTeam}', '${useUmpireTeam}'`,
        ");"
      ].join('');
    })
  ];
  const result: any = {
    properties: { pitches, categories, teams, groups },
    fixtures: dataRows,
    sql: rows.join('\n')
  }
  return result;
}

