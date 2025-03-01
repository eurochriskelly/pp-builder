export const showCompetition = async (
  fixtures: any,
  category: string | null
) => {
  try {
    const fixturesNeat = fixtures
      .filter((x: any) => category ? x.category === category : true)
      .sort((a: any, b: any) => {
        return a.scheduledTime > b.scheduledTime ? 1 : a.scheduledTime < b.scheduledTime ? -1 : 0
      })
      .map((fixture: any) => { 
        const {id, pitch, category, groupNumber, stage, scheduledTime, startedTime, team1, team2, umpireTeam, goals1, points1, goals2, points2 } = fixture
        return {
          id,
          pitch,
          cat: category,
          grp: groupNumber,
          sched: scheduledTime,
          start: startedTime,
          team1, 
          score1: goals1 !== null ? `${goals1}-${points1} (${goals1 * 3 + points1})` : '',
          stage,
          score2: goals2 !== null ? `(${goals2 * 3 + points2}) ${goals2}-${points2}` : '',
          team2,
          umpireTeam,
        }
      })
    console.table(fixturesNeat);
  } catch (error: any) {
    console.log(error)
    console.error('Error fetching data:', error?.code);
  }
}
