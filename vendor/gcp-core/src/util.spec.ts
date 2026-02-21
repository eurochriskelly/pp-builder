const { 
  calculateNextGameStartTime, 
  calculateGroupStageFixtures,
  calculateKnockoutStageFixtures,
  getTeamIds,
  assignTeamsToGroups,
} = require("./util");

const VERBOSE = false;

describe("Useful utility functions", () => {
  it("can calculate time for upcoming matches", () => {
    var nextTime = "";
    nextTime = calculateNextGameStartTime("10:00", 10, 4);
    expect(nextTime).toBe("10:30");
    nextTime = calculateNextGameStartTime("12:45", 15, 6);
    expect(nextTime).toBe("13:30");
  });

  it("organizes the teams into a power of 2 number of groups", () => {
    const groups = [
      "Team 1",
      "Team 2",
      "Team 3",
      "Team 4",
      "Team 5",
      "Team 6",
      "Team 7",
      "Team 8",
      "Team 9",
      "Team 10",
      "Team 11",
      "Team 12",
      "Team 13",
      "Team 14",
      // exect 3 sub-groups of 3 teams and 2 sub-groups of 4 teams
    ];
    var result 
    result = assignTeamsToGroups(groups);
    expect(result.length).toBe(4)
    expect(result[0].length).toBe(4)
    expect(result[1].length).toBe(4)
    expect(result[2].length).toBe(3)
    expect(result[3].length).toBe(3)
    // check with a smaller group, e.g. 6 teams 
    result = assignTeamsToGroups(groups.slice(0,6))
    expect(result.length).toBe(2)
    expect(result[0].length).toBe(3)
    expect(result[1].length).toBe(3)
  });


  it('maximizes rest time for teams in stage', () => {
    const slack = [0, 0, 60, 40, 25, 20, 15];
    const groups = [
      ['Team 1', 'Team 2', 'Team 3', 'Team 4', 'Team 11'],
      ['Team 5', 'Team 6', 'Team 7'],
      ['Team 8', 'Team 9', 'Team 10'],
    ]
    const matches = calculateGroupStageFixtures('Mens', groups, slack, false);
    // console.table(matches.filter(m => m.group === 0))
    matches.forEach((match: any) => {
      expect(match?.allottedTime).toBeGreaterThanOrEqual(0)
    })
  })

  it('schedules group fixtures', () => {
    const cat = 'Mens';
    const groups = [
      ['Team 1', 'Team 2', 'Team 3', 'Team 4'],
      ['Team 5', 'Team 6', 'Team 7'],
      ['Team 8', 'Team 9', 'Team 10'],
      ['Team 11', 'Team 12', 'Team 13']
    ]
    const matches = calculateGroupStageFixtures(cat, groups, [0, 0, 60, 40, 25, 20, 15]);
    // console.table(matches)
    // how many matches were defined for this group?
    expect(matches.length).toBe(
      (1 + 2 + 3) + // A group of 4
      (1 + 2) +     // A group of 3
      (1 + 2) +     // A group of 3
      (1 + 2)       // A group of 3
    );
    //console.table(matches)
  })

});

describe("Knockout stage fixtures", () => {
  it('Can work out team ids based on list', () => {
    let ids = []
    ids = getTeamIds([0, 3], [4, 3, 3, 3])
    expect(ids).toEqual([1, 2, 3, 4])
    ids = getTeamIds([8, 15], [5, 3, 3, 3])
    expect(ids).toEqual([1, 2, 3, 4, 5, 6])
    ids = getTeamIds([4, 15], [6, 5])
    expect(ids).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('schedules knockout fixtures for a 4-team bracket', () => {
    const range = [0, 3];
    const groupSizes = [4, 3, 3, 3];
    const slack = [25, 30, 35, 40];
    const matches = calculateKnockoutStageFixtures(
      range,
      groupSizes,
      slack
    );
    // prettyPrintMatches(matches);
    expect(matches.length).toBe(4)
    expect(matches[0].stage).toBe('semis:1')
    expect(matches.filter((m: any) => m.stage === 'finals:1').shift().allottedTime).toBe(slack.pop())
  })
  it('schedules knockout fixtures for a 8-team bracket with fewer than 8 teams', () => {
    // With all 8 teams in the last bracket
    {
      const range = [8, 15];
      const groupSizes = [4, 4, 4, 4];
      const slack = [25, 30, 35, 40];
      const matches = calculateKnockoutStageFixtures(
        range,
        groupSizes,
        slack
      );
      // prettyPrintMatches(matches)
      expect(matches.length).toBe(8)
      const quarters = matches.filter((m: any) => m.stage.startsWith('quarters'))
      expect(quarters.length).toBe(4)
      const semis = matches.filter((m: any) => m.stage.startsWith('semis'))
      expect(semis.length).toBe(2)
      const firstSemis = matches.filter((m: any) => m.stage === 'semis:1').shift()
      expect(firstSemis.team1.stage).toBe('quarters')
      expect(firstSemis.team2.stage).toBe('quarters')
    }
    // With 6 teams in the last bracket
    {
      const range = [8, 15];
      const groupSizes = [4, 4, 3, 3];
      const slack = [25, 30, 35, 40];
      const matches = calculateKnockoutStageFixtures(
        range,
        groupSizes,
        slack
      );
      // prettyPrintMatches(matches)
      expect(matches.length).toBe(6)
      const quarters = matches.filter((m: any) => m.stage.startsWith('quarters'))
      expect(quarters.length).toBe(2)
      const semis = matches.filter((m: any) => m.stage.startsWith('semis'))
      expect(semis.length).toBe(2)
      const firstSemis = matches.filter((m: any) => m.stage === 'semis:1').shift()
      expect(firstSemis.team1.stage).toBe('group')
      expect(firstSemis.team2.stage).toBe('quarters')
    }
    // With 4 teams in the last bracket
    {
      const range = [8, 15];
      const groupSizes = [3, 3, 3, 3];
      const slack = [25, 30, 35, 40];
      const matches = calculateKnockoutStageFixtures(
        range,
        groupSizes,
        slack
      );
      // prettyPrintMatches(matches)
      expect(matches.length).toBe(4)
      const quarters = matches.filter((m: any) => m.stage.startsWith('quarters'))
      expect(quarters.length).toBe(0)
      const semis = matches.filter((m: any) => m.stage.startsWith('semis'))
      expect(semis.length).toBe(2)
      const firstSemis = matches.filter((m: any) => m.stage === 'semis:1').shift()
      expect(firstSemis.team1.stage).toBe('group')
      expect(firstSemis.team2.stage).toBe('group')
    }
  })
})
