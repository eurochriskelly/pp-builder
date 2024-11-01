import { wrapRows, getScheduleProps } from './utils';
import { validateFixtures } from './validate';
import { generateClubInsertStatement, generateTeamInsertStatement } from './club-update';

const csvRows = (csv: string) => {
  const lines = csv.split('\n').filter(x => x.trim())
  const delim = lines[0].includes(',') ? ',' : ';';
  const rows = lines.slice(1).map(row => row.split(delim));
  console.table(rows.slice(0, 3));
  return rows
}

export const importClubsCsv = (
  csv: string
) => {
  const sqlInserts : string[] = [
    'USE EuroTourno;',
    `DELETE FROM clubTeams;`,
    `DELETE FROM clubs;`,
  ];
  const rows = csvRows(csv);
  rows.slice(1).forEach(r => {
    const [
      id, student, clubName,
      yearFounded, yearAffiliated, yearDissolved,
      countryCode, city, region, subregion, status,
      teamGAA, teamLGFA, teamHurling, teamCamogie, teamHandball, teamRounders, teamYouthFootball, teamYouthHurling,
      domain ] = r
    const teams: any = {
      teamGAA, teamLGFA, teamHurling, teamCamogie, 
      teamHandball, teamRounders, teamYouthFootball, teamYouthHurling,
    }
    const clubId = 1000 + +id
    sqlInserts.push(generateClubInsertStatement({
      clubId,
      isStudent: !!(student?.toLowerCase() === 'yes'),
      clubName, 
      founded: +yearFounded, 
      affiliated: yearAffiliated ? +yearAffiliated : +yearFounded,
      deactivated: yearDissolved ? +yearDissolved : null,
      country: countryCode,
      city, 
      region, 
      subregion: subregion|| null,
      status,
      domain: domain?.startsWith('xxx.') ? domain.substring(4) : null
    }));
    Object.keys(teams).forEach((team: any) => {
      if (teams[team] && +teams[team] > 0) {
        sqlInserts.push(generateTeamInsertStatement({
          clubId,
          teamName: null,
          category: team.substring(4).toLowerCase(),
          foundedYear: null,
          status: 'active',
          contactEmail: null
        }))
      }
    })
  })
  console.log(sqlInserts.join('\n').split('\n').map(line => line.trim()).filter(x => x).join('\n'));
}

export const importFixturesCsv = (
  csv: string,
  tournamentId: string,
  startDate: string,
  title: string,
  location: string,
  pinCode: string
) => {
  const rows = csvRows(csv);
  const dataIn: any = {
    tournamentId: +tournamentId,
    startDate,
    title,
    location,
    pinCode,
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
  if (!team?.startsWith('~match:')) return team
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
  const { tournamentId, startDate, title, location, pinCode } = data
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
    'DELETE FROM `EuroTourno`.`tournaments` WHERE `id` = ' + tournamentId + ';',
    'DELETE FROM `EuroTourno`.`cards` WHERE `tournament` = ' + tournamentId + ';',
    // Ensure the tournament exists
    'INSERT INTO `EuroTourno`.`tournaments` (id, Date, Title, Location, Lat, Lon, code)',
    `VALUES (${tournamentId}, '${startDate}', '${title}', '${location}', 52.2942, 4.842, '${pinCode}')`,
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

