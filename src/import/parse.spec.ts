import { processPastedFixtures, normalizeMatchString, getCategories, computeMatchIds } from './parse';
// Removed duplicate imports below

describe('Processing fixture data', () => {
  // Helper function to find row index by original match identifier
  const findRowIndexByMatch = (data: any, match: string) => {
      const normalizedMatch = normalizeMatchString(match); // Use the same normalization
      const categories = getCategories(data["MATCH"]); // Recalculate categories based on input data
      const targetMatchId = computeMatchIds([normalizedMatch], categories)[0];
      return data.matchId.findIndex((id: string) => id === targetMatchId);
  };


  it('Pre-processes pasted fixtures', () => {
   const res = processPastedFixtures(`
TIME	MATCH	PITCH	TEAM1	STAGE	TEAM2	UMPIRES	DURATION	REFEREE	CATEGORY
11:30	L.1	WEIMERSKIRSCH	Luxembourg A	GP.1	Eindhoven	Leuven/Maastricht			LADIES
12:05	L.2	WEIMERSKIRSCH	Lux B/Den Haag/Cologne	GP.2	Nijmegen/Brus.B/Frank	Brussels A			LADIES
12:40	L.3	WEIMERSKIRSCH	Leuven/Maastricht	GP.1	Luxembourg A	Eindhoven			LADIES
13:15	L.4	WEIMERSKIRSCH	Brussels A	GP.2	Lux B/Den Haag/Cologne	Nijmegen/Brus.B/Frank			LADIES
13:50	L.5	WEIMERSKIRSCH	Eindhoven	GP.1	Leuven/Maastricht	Luxembourg A			LADIES
14:25	L.6	WEIMERSKIRSCH	Nijmegen/Brus.B/Frank	GP.2	Brussels A	Lux B/Den Haag/Cologne			LADIES
15:45	L.7	CESSANGE-1	2nd Gp.1	CUP.SF1	1st Gp.2	loser M.20	20 mins		LADIES
16:00	L.8	CESSANGE-2	1st Gp.1	CUP.SF2	2nd Gp.2	loser M.21	20 mins		LADIES
16:30	L.9	CESSANGE-2	3rd Gp.1	CUP.5/6	3rd Gp.2	loser L.8	20 mins		LADIES
17:35	L.10	CESSANGE-1	winner L.7	CUP.FIN	winner L.8	loser M.23	20 mins		LADIES
18:05	L.11	CESSANGE-1	loser L.7	CUP.3/4	loser L.8	loser L.10	20 mins		LADIES
10:30	M.1	CESSANGE-1	Eindhoven	GP.1	Frankfurt	Luxembourg B			MENS
10:30	M.10	CESSANGE-2	Luxembourg A	GP.2	Brussels B/Lux C	Brussels A			MENS
10:55	M.2	CESSANGE-1	Leuven A	GP.1	Leuv B/Nijmeg/D'dorf	Eindhoven			MENS
11:00	M.11	CESSANGE-2	Brussels A	GP.2	Den Haag/Maastricht	Brussels B/Lux C			MENS
11:20	M.3	CESSANGE-1	Frankfurt	GP.1	Luxembourg B	Leuv B/Nijmeg/D'dorf			MENS
11:35	M.12	CESSANGE-2	Luxembourg A	GP.2	Den Haag/Maastricht	Brussels A			MENS
11:45	M.4	CESSANGE-1	Eindhoven	GP.1	Leuven A	Luxembourg B			MENS
12:05	M.13	CESSANGE-2	Brussels B/Lux C	GP.2	Brussels A	Den Haag/Maastricht			MENS
12:10	M.5	CESSANGE-1	Frankfurt	GP.1	Leuv B/Nijmeg/D'dorf	Leuven A			MENS
12:35	M.6	CESSANGE-1	Eindhoven	GP.1	Luxembourg B	Leuv B/Nijmeg/D'dorf			MENS
12:40	M.14	CESSANGE-2	Luxembourg A	GP.2	Brussels A	Brussels B/Lux C			MENS
13:10	M.15	CESSANGE-2	Den Haag/Maastricht	GP.2	Brussels B/Lux C	Luxembourg A			MENS
13:10	M.7	CESSANGE-1	Leuven A	GP.1	Luxembourg B	Frankfurt			MENS
13:35	M.8	CESSANGE-1	Eindhoven	GP.1	Leuv B/Nijmeg/D'dorf	Luxembourg B			MENS
13:45	M.16	CESSANGE-2	Leuven A	GP.1	Frankfurt	Den Haag/Maastricht			MENS
14:05	M.9	CESSANGE-1	Leuv B/Nijmeg/D'dorf	GP.1	Luxembourg B	Eindhoven			MENS
14:35	M.17	CESSANGE-2	5th Gp.1	SHD.QF1	4th Gp.2	3rd Gp.2	60		MENS
14:45	M.18	CESSANGE-1	1ST Gp.1	CUP.SF1	2nd Gp.2	4th Gp.1	20 mins		MENS
15:00	M.19	CESSANGE-2	2nd Gp.1	CUP.SF2	1st Gp.2	loser M.17	20 mins		MENS
15:15	M.20	CESSANGE-1	3RD Gp.1	SHD.SF1	4th Gp.2	loser M.18	20 mins		MENS
15:30	M.21	CESSANGE-2	4th Gp.1	SHD.SF2	winner M.17	loser M.19	20 mins		MENS
16:15	M.22	CESSANGE-1	winner M.18	CUP.FIN	winner M.19	loser L.7	30mins		MENS
16:55	M.23	CESSANGE-1	winner M.20	SHD.FIN	winner M.21	loser M.22	30mins		MENS
17:00	M.24	CESSANGE-2	loser M.20	SHD.3/4	loser M.21	loser L.9	15 mins		MENS
17:25	M.25	CESSANGE-2	loser M.18	CUP.3/4	loser M.19	winner M.24	20 mins		MENS
17:55	M.26	CESSANGE-2	loser M.17	SHD.4/5	loser M.21	loser M.25	20 mins		MENS
18:30	B.1	CESSANGE-1	best 1st place	BEST.SF1	2nd best 3rd place	loser M.26	15 mins		BEST
`)

    // console.log('--- Processed Data ---');
    // console.log(JSON.stringify(res.data, null, 2));
    // console.log('--- Generated CSV ---');
    // console.log(res.csv);

    // Find the index of the new test row using the helper
    const testRowIndex = findRowIndexByMatch(res.data, 'B.1');

    expect(testRowIndex).toBeGreaterThan(-1); // Ensure the row was found

    // --- Assertions for the "best" format row (B.1) ---
    // Assertions for team1: "best 1st place"
    expect(res.data.team1[testRowIndex]).toBe('~');
    expect(res.data.pool1[testRowIndex]).toBe('best');
    expect(res.data.pool1Id[testRowIndex]).toBe('1'); // Default rank is 1
    expect(res.data.position1[testRowIndex]).toBe('1'); // Place is 1st

    // Assertions for team2: "2nd best 3rd place"
    expect(res.data.team2[testRowIndex]).toBe('~');
    expect(res.data.pool2[testRowIndex]).toBe('best');
    expect(res.data.pool2Id[testRowIndex]).toBe('2'); // Rank is 2nd
    expect(res.data.position2[testRowIndex]).toBe('3'); // Place is 3rd

    // Check other details for the B.1 row
    expect(res.data.category[testRowIndex]).toBe('B');
    expect(res.data.stage[testRowIndex]).toBe('best_sf1'); // Check stage parsing

    // --- Example Assertions for other row types (optional but good practice) ---

    // Check a group stage row (e.g., L.1)
    const groupRowIndex = findRowIndexByMatch(res.data, 'L.1');
    expect(groupRowIndex).toBeGreaterThan(-1);
    expect(res.data.team1[groupRowIndex]).toBe('Luxembourg A'); // Should be actual team name
    expect(res.data.pool1[groupRowIndex]).toBe(''); // Pool info not applicable for direct teams
    expect(res.data.pool1Id[groupRowIndex]).toBe('');
    expect(res.data.position1[groupRowIndex]).toBe('');
    expect(res.data.stage[groupRowIndex]).toBe('group');
    expect(res.data.group[groupRowIndex]).toBe('1');

    // Check a winner/loser row (e.g., L.7)
    const winnerLoserRowIndex = findRowIndexByMatch(res.data, 'L.7');
    expect(winnerLoserRowIndex).toBeGreaterThan(-1);
    // Team 1: "2nd Gp.1"
    expect(res.data.team1[winnerLoserRowIndex]).toBe('~');
    expect(res.data.pool1[winnerLoserRowIndex]).toBe('group');
    expect(res.data.pool1Id[winnerLoserRowIndex]).toBe('1');
    expect(res.data.position1[winnerLoserRowIndex]).toBe('2'); // 2nd place
    // Team 2: "1st Gp.2"
    expect(res.data.team2[winnerLoserRowIndex]).toBe('~');
    expect(res.data.pool2[winnerLoserRowIndex]).toBe('group');
    expect(res.data.pool2Id[winnerLoserRowIndex]).toBe('2');
    expect(res.data.position2[winnerLoserRowIndex]).toBe('1'); // 1st place
    expect(res.data.stage[winnerLoserRowIndex]).toBe('cup_sf1');

    // Check a match reference row (e.g., M.25)
    const matchRefRowIndex = findRowIndexByMatch(res.data, 'M.25');
    expect(matchRefRowIndex).toBeGreaterThan(-1);
    // Team 1: "loser M.18" (M.18 -> matchId 318)
    expect(res.data.team1[matchRefRowIndex]).toBe('~');
    expect(res.data.pool1[matchRefRowIndex]).toBe('match');
    expect(res.data.pool1Id[matchRefRowIndex]).toBe('318'); // Match ID for M.18
    expect(res.data.position1[matchRefRowIndex]).toBe('2'); // Loser is position 2
    // Team 2: "loser M.19" (M.19 -> matchId 319)
    expect(res.data.team2[matchRefRowIndex]).toBe('~');
    expect(res.data.pool2[matchRefRowIndex]).toBe('match');
    expect(res.data.pool2Id[matchRefRowIndex]).toBe('319'); // Match ID for M.19
    expect(res.data.position2[matchRefRowIndex]).toBe('2'); // Loser is position 2
    expect(res.data.stage[matchRefRowIndex]).toBe('cup_3rd4th'); // Stage CUP.3/4

  })
})

// Removed duplicate imports that were moved to the top



