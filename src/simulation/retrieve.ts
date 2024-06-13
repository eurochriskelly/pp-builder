import axios from 'axios';
const API = `http://localhost:4000/api/tournaments`;

export async function getSchedule(
  id: number,
  category: string | null
): Promise<void> {
  try {
    const endpoint = `${API}/${id}/fixtures/nextup`;
    const response = await axios.get(endpoint);
    if (category) {
      return response.data.data.filter((x: any) => x.category === category)
    } else {
      return response.data.data
    }
  } catch (error: any) {
    console.error('Error fetching data:', error?.code);
  }
}

export const playMatch = async (
  fixture: any,
  score: any,
) => {
  const generateTeamData = (
    name1: string,
    name2: string,
    category: string
  ) => {
    const getRandomInt = (max: number) => Math.floor(Math.random() * max);
    var team1 = { name: name1, goals: getRandomInt(6), points: getRandomInt(23), category };
    var team2 = { name: name2, goals: getRandomInt(6), points: getRandomInt(23), category };
    return { team1: team1, team2: team2 };
  }
  const { tournamentId, matchId, team1, team2, category } = fixture
  try {
    await axios.get(`${API}/${tournamentId}/fixtures/${matchId}/start`);
    const data = generateTeamData(team1, team2, category);
    await axios.post(`${API}/${tournamentId}/fixtures/${matchId}/score`, data);
  } catch (error: any) {
    console.error('Error fetching data:', error?.code);
  }
}

export const getFixtures = async (
  id: number
) => {
  const endpoint = `${API}/${id}/fixtures`;
  const response = await axios.get(endpoint);
  return response.data.data
}
