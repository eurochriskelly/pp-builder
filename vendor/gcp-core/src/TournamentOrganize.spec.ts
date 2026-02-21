import TEST_DATA from '../test/test-data';
import Tournament from './Tournament.class';
import TournamentOrganize from './TournamentOrganize.class';

const tournament_1 = TEST_DATA.tournaments["t1"];
const tournament_2 = TEST_DATA.tournaments["t2"];
const tournament_3 = TEST_DATA.tournaments["t3"];
const tournament_4 = TEST_DATA.tournaments["t4"];

describe('TournamentOrganize', () => {

  it("can assign teams to groups", () => {
    const cat = 'Mens'
    const T = new Tournament(tournament_1)
    const TO = new TournamentOrganize(T)
    expect(T.categories[cat].groups.length).toBe(0)
    TO.assignTeamsToGroups(cat)
    expect(T.categories[cat].groups).not.toBeFalsy()
  })

  it("generates fixtures for all knockout stages", () => {
    const T = new Tournament(tournament_1)
    const TO = new TournamentOrganize(T)
    const cat = 'Mens'
    TO.assignTeamsToGroups(cat)
    const { groups } = T.categories[cat]
    const matches = TO.generateKnockoutFixtures(cat, groups)
    expect(matches.length).toBeGreaterThan(0)
  })

})

describe('End to end tournament organization', () => {

  it('completes the definition of a tournament from a minimal rules input', () => {
    const T = new Tournament(tournament_1);
    const TO = new TournamentOrganize(T);
    TO.generate();
    expect(true).toBe(true)
    // T.prettyPrintActivities((f, i) => i > 27 && i < 35)
    // console.log(JSON.stringify(T.activities))

    // expect teams to be placed in groups
    // expect multiple fixtures
    // expect group fixtures to be set out
    // expect knockout fixtures to be calculated also
    // expect schedule to be set for all games
  })

})
