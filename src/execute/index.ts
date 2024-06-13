import axios from 'axios';

const API = `http://localhost:4000/api/tournaments`

export async function getSchedule(
  id: number,
  category: string
): Promise<void> {
  try {
    const endpoint = `${API}/${id}/fixtures/nextup`;
    const response = await axios.get(endpoint);
    return response.data.data.filter((x: any) => x.category === category)
  } catch (error: any) {
    console.error('Error fetching data:', error?.code);
  }
}

export const showCompetition = async (
  id: number,
  category: string
) => {
  try {
    const endpoint = `${API}/${id}/fixtures`;
    const response = await axios.get(endpoint);
    const fixtures = response.data.data
      .filter((x: any) => x.category === category)
      .map((fixture: any) => { 
        const {id, pitch, groupNumber, stage, scheduledTime, startedTime, team1, team2, umpireTeam, goals1, points1, goals2, points2 } = fixture
        return {
          id,
          pitch,
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
    console.table(fixtures);
  } catch (error: any) {
    console.error('Error fetching data:', error?.code);
  }
}

const generateTeamData = (
  name1: string,
  name2: string,
  category: string
) => {
  function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  var team1 = {
    name: name1,
    goals: getRandomInt(6),
    points: getRandomInt(23),
    category,
  };

  var team2 = {
    name: name2,
    goals: getRandomInt(6),
    points: getRandomInt(23),
    category,
  };

  var data = {
    team1: team1,
    team2: team2
  };

  return data;
}

const playMatch = async (
  fixture: any,
  score: any,
) => {
  const { tournamentId, matchId, team1, team2, category } = fixture
  try {
    await axios.get(`${API}/${tournamentId}/fixtures/${matchId}/start`);
    const data = generateTeamData(team1, team2, category);
    await axios.post(`${API}/${tournamentId}/fixtures/${matchId}/score`, data);
  } catch (error: any) {
    console.error('Error fetching data:', error?.code);
  }
}


export const play = async (
  id: number, 
  category:string
) => {
  const schedule: any = await getSchedule(id, category);
  const nextMatch = schedule.filter((x: any) => x.isType !== 'recent')
  if (nextMatch.length) {
    const match = nextMatch[0]
    console.log(match.matchId)
    await playMatch(match, '0-01/0-03');
  } else {
    console.log('No more matches ...')
  }
  await showCompetition(id, category);
}
