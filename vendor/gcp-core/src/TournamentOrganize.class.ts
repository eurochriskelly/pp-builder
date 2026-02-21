import { ITournament } from "../types";
/**
 * This class takes care of organizing a Tournament
 * It's duties include:
 * - Adding fixtures for the group stage
 * - Swapping teams around to even up groups
 * - Swapping teams around to better fit travel schedule for teams
 * - Calculating fixtures for the knockout stage for each cup in tournament
 * - Scheduling the tournament
 *
 */
import { 
  assignTeamsToGroups,
  calculateGroupStageFixtures,
  calculateKnockoutStageFixtures
} from "./util";
import PitchAllocator from './PitchAllocator.class';

class TournamentOrganize {
  tournament: ITournament;
  nextFixture: number;
  constructor(T: ITournament) {
    this.tournament = T;
    this.nextFixture = 1;
  }

  /**
   * Generate fixtures for the tournament by apply the following steps:
   * 1. [x] Assign teams to groups
   * 2. [x] Generate group stage fixtures (external function)
   * 3. [x] Order group stage fixtures
   * 4. [x] Generate knockout stage fixtures
   * 5. [X] Order knockout stage fixtures
   * 6  [ ] Assign fixtures to pitches for each category
   * 7  [ ] Optional: balance pitch allocation
   * 6. [ ] Assign upmires to fixtures
   */
  generate() {
    const categoryNames = Object.keys(this.tournament.categories);
    this.nextFixture = 1;
    // Assign teams to groups 
    const T = this.tournament;
    T.clearActivities();
    const doAssignGroupFixtures = (cat: string) => {
      this.assignTeamsToGroups(cat, true);
      const fixtures = calculateGroupStageFixtures(
        cat,
        T.categories[cat].groups,
        [0, 0, 30, 25, 20, 20, 15]
      )
      T.fixturesAppend(fixtures);
    }

    // Setup and order group stage fixtures
    categoryNames.forEach(doAssignGroupFixtures);
    this.orderGroupStageFixtures();

    // Generate knockout stage fixtures
    const doAssignKnockoutFixtures = (cat: string) => {
      const knockoutFixtures = this.generateKnockoutFixtures(cat, T.groupSizes[cat]);
      T.fixturesAppend(knockoutFixtures);
      this.orderKnockoutStageFixtures(cat);
    }
    categoryNames.forEach(doAssignKnockoutFixtures);

    // Assign pitches to fixtures
    const PA = new PitchAllocator(T)
    categoryNames.forEach(cat => PA.allocate(cat));

    T.updateLetters();
    // const filt = f => f.category === 'Mens' && f.stage !== 'group'
    //  T.prettyPrintActivities(filt);
  }

  // 1. Assign teams to groups
  assignTeamsToGroups(category: string, randomize = false) {
    const T = this.tournament;
    const { teams } = T.categories[category];
    T.categories[category].groups = assignTeamsToGroups(teams, randomize);
  }

  orderKnockoutStageFixtures(cat: string) {
    const T = this.tournament;
    const catFixtures = T.activities.filter(f => f.category === cat && f.stage === 'group')
    const lastOffset = catFixtures.pop().offset; 
    const catKnockoutFixtures = T.activities.filter(f => f.category === cat && f.stage !== 'group')
    // For each non-group fixture, order by idealized order
    // In principle, all brackets can be played in parallel if there are pitches and refs available
    // So we can order by offset
    T.bracketNames[cat].forEach((bracket: string) => {
      let bracketOffset = 0;
      const bracketFixtures = catKnockoutFixtures.filter(f => f.bracket === bracket)
      const seenOrders = [...(new Set(bracketFixtures.map(f => f.order)))]
      seenOrders.sort().forEach(order => {
        let maxAllottedTime = 0;
        bracketFixtures
          .filter(f => f.order === order)
          .forEach(fixture => {
            fixture.offset = lastOffset + bracketOffset + fixture.allottedTime 
            maxAllottedTime = Math.max(maxAllottedTime, fixture.allottedTime)
          })
        bracketOffset += maxAllottedTime;
      })
    })
  }

  generateKnockoutFixtures(cat: string, groupSizes: number[]) {
    const T = this.tournament;
    let matches: any = [];
    const brackets: any = T.categories[cat]?.rules?.elimination?.brackets
    const elimSlack = [ 30, 35, 40, 45 ];
    let bracketCursor = 0;
    const bracketNames = Object.keys(brackets);
    bracketNames.forEach(bracket => {
      let bracketMatches = [];
      // determine the number of teams in the bracket
      const numTeams: any = brackets[bracket];
      const range = [bracketCursor, bracketCursor + numTeams - 1]
      bracketCursor += numTeams;
      const enhance = (match: any) => {
        const [stage, group] = match.stage.split(':')
        return {
          matchId: this.nextFixture++,
          offset: -1,
          ...match,
          stage, 
          group: group ? parseInt(group) : null, 
          bracket,
          category: cat,
          numTeams
        }
      }
      bracketMatches = calculateKnockoutStageFixtures(range, groupSizes, elimSlack).map(enhance)
      matches = [ ...matches, ...bracketMatches ]
    })
    return matches;
  }


  // 3. Generate group stage fixtures
  orderGroupStageFixtures() {
    // order by idealized order (i.e. if each schedule )\
    const T = this.tournament;
    T.activities = T.activities.sort((a, b) => {
      return a.offset > b.offset ? 1 : b.offset > a.offset ? -1 : 0;
    });
    T.activities.forEach(fixture => {
      fixture.matchId = this.nextFixture++;
    })
  }
}

export default TournamentOrganize;
