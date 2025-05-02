type FixtureData = Record<string, string[]>;

const groupTypes = new Set(['gp', 'grp', 'group', 'pool', 'ple', 'poule']);

const getCategories = (matches: string[]) => [...new Set(matches.map(match => match.split('.')[0]))];

const computeMatchIds = (matches: string[], categories: string[]) =>
  matches.map(match => {
    const [cat, numStr] = match.split('.');
    const num = parseInt(numStr, 10);
    const catIndex = categories.indexOf(cat);
    return ((catIndex + 1) * 100 + num).toString();
  });

const computeStageColumn = (stages: string[]) =>
  stages.map(stageRaw => {
    const parts = stageRaw.toLowerCase().split('.');
    const first = parts[0];
    if (groupTypes.has(first)) return 'group';
    let second = parts[1] || '';
    if (second === "3/4") second = "3rd4th";
    else if (second === "4/5") second = "5th6th";
    else if (second === "7/8") second = "7th8th";
    else if (second.startsWith("sf")) second = "semis";
    else if (second.startsWith("qf")) second = "quarters";
    else if (second === "fin") second = "finals";
    return `${first}_${second}`;
  });

const computeGroupColumn = (stages: string[]) =>
  stages.map(stageRaw => {
    const parts = stageRaw.toLowerCase().split('.');
    const first = parts[0];
    if (groupTypes.has(first)) return parts[1] || "1";
    const second = parts[1] || "";
    if (second.includes('/')) return "1";
    const numMatch = second.match(/\d+$/);
    return numMatch ? numMatch[0] : "1";
  });

const populateCategoryColumn = (data: FixtureData, categories: string[]): string[] => {
  if (data["CATEGORY"]) return data["CATEGORY"];
  if (data["COMPETITION"]) return data["COMPETITION"];
  // fallback: infer from MATCH column
  return data["MATCH"].map(match => match.split('.')[0]);
};

const parseTeamColumn = (
  colName: string,
  index: number | string,
  data: FixtureData,
  categories: string[],
  overrideKeys?: { teamKey?: string; poolKey?: string; poolIdKey?: string; positionKey?: string }
) => {
  const input = data[colName];
  const stageCol = data["stage"];

  const teamKey = overrideKeys?.teamKey ?? `team${index}`;
  const poolKey = overrideKeys?.poolKey ?? `pool${index}`;
  const poolIdKey = overrideKeys?.poolIdKey ?? `pool${index}Id`;
  const positionKey = overrideKeys?.positionKey ?? `position${index}`;

  const team: string[] = [];
  const pool: string[] = [];
  const poolId: string[] = [];
  const position: string[] = [];

  input.forEach((val, i) => {
    const stage = stageCol[i].toLowerCase();
    if (stage === "group") {
      team.push(val);
      pool.push('');
      poolId.push('');
      position.push('');
    } else {
      team.push('~');
      const v = val.toLowerCase().trim();
      if (v.startsWith("winner ") || v.startsWith("loser ")) {
        const isWinner = v.startsWith("winner ");
        const [cat, numStr] = v.replace(/^(winner|loser)\s+/, '').split('.');
        const num = parseInt(numStr, 10);
        let catIndex = categories.findIndex(c => c.toLowerCase() === cat);
        if (catIndex === -1) catIndex = 0;
        const matchId = (catIndex + 1) * 100 + num;
        pool.push("match");
        poolId.push(matchId.toString());
        position.push(isWinner ? "1" : "2");
      } else {
        const parts = v.split(' ');
        const posMatch = parts[0].match(/^\d+/);
        position.push(posMatch ? posMatch[0] : '');
        const poolPart = parts[1] || '';
        if (poolPart.includes('/')) {
          pool.push("group");
          poolId.push("1");
        } else {
          const [poolKeyRaw, poolVal] = poolPart.split('.');
          pool.push(groupTypes.has(poolKeyRaw) ? "group" : poolKeyRaw);
          poolId.push(poolVal);
        }
      }
    }
  });

  data[teamKey] = team;
  data[poolKey] = pool;
  data[poolIdKey] = poolId;
  data[positionKey] = position;
};

const normalizeDurationColumn = (rawDurations: string[]): string[] =>
  rawDurations.map(val => {
    const cleaned = val.replace(/[^\d]/g, ''); // remove non-digits
    return cleaned || '20'; // default to 20 if empty
  });


const toCSV = (data: FixtureData, headers: string[]): string => {
  console.log('data is ', data)
  const rows: string[] = [];
  // Header
  rows.push(headers.join(';'));
  // Rows
  const rowCount = data[headers[0]].length;
  for (let i = 0; i < rowCount; i++) {
    const row = headers.map(h => data[h][i] ?? '');
    rows.push(row.join(';'));
  }
  return rows.join('\n');
};

export const processPastedFixtures = (tsvData: string) => {
  console.log('processing parse fixtures', tsvData)
  const lines = tsvData.split('\n').filter(line => line.trim());
  const headers = lines.shift()!.split('\t').map(x => x.trim());

  const data: FixtureData = headers.reduce((acc, header) => {
    acc[header] = [];
    return acc;
  }, {} as FixtureData);

  lines.forEach(line => {
    const values = line.split('\t');
    headers.forEach((header, i) => {
      data[header].push(values[i].trim() || '');
    });
  });

  const categories = getCategories(data["MATCH"]);
  data["matchId"] = computeMatchIds(data["MATCH"], categories);
  data["stage"] = computeStageColumn(data["STAGE"]);
  data["group"] = computeGroupColumn(data["STAGE"]);

  parseTeamColumn("TEAM1", 1, data, categories);
  parseTeamColumn("TEAM2", 2, data, categories);
  parseTeamColumn("UMPIRES", "U", data, categories, {
    teamKey: "umpireTeam",
    poolKey: "poolUmp",
    poolIdKey: "poolUmpId",
    positionKey: "positionUmp"
  });
  data["duration"] = normalizeDurationColumn(data["DURATION"]);
  data["category"] = populateCategoryColumn(data, categories);

  // Normalize time and pitch (just alias with lowercase keys)
  data["time"] = data["TIME"];
  data["pitch"] = data["PITCH"];

  // Final CSV headers in desired order
  const csvHeaders = [
    "matchId", "time", "pitch", "stage", "category", "group",
    "team1", "team2", "umpireTeam", "duration",
    "pool1", "pool1Id", "position1",
    "pool2", "pool2Id", "position2",
    "poolUmp", "poolUmpId", "positionUmp"
  ];

  const csv = toCSV(data, csvHeaders);
  return { data, categories, csv };
};

