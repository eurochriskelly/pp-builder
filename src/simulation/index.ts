import { showCompetition } from './display';
import { getSchedule, playMatch, getFixtures } from './retrieve';

export const play = async (
  id: number, 
  category:string | null,
  count: number
) => {
  let fixtures: any = await getFixtures(id);
  const play = async (n: number) => {
    n++
    const schedule: any = await getSchedule(id, category);
    const nextMatch = schedule.filter((x: any) => x.isType !== 'recent')
    if (nextMatch.length) {
      const match = nextMatch[0]
      console.log(`Playing match [${match.matchId}]`)
      await playMatch(match, '0-01/0-03');
      if (n < count) {
        await play(n + 1)
      }
    }
  }
  if (count > 0) {
    await play(0)
  }
  fixtures= await getFixtures(id);
  await showCompetition(fixtures, category);
  const schedule: any = await getSchedule(id, category);
  const nextMatch = schedule.filter((x: any) => x.isType !== 'recent')
  if (nextMatch.length) {
    const {matchId, category } = nextMatch[0]
    console.log(`(count ${count}) Next match is ${category} - ${matchId}`);
  }
}
