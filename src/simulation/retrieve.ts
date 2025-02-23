import axios from 'axios';
const API = `http://localhost:4000/api/tournaments`;

export async function getSchedule(
  id: number,
  category: string | null
): Promise<any> {  // Changed return type to any for consistency
  try {
    const endpoint = `${API}/${id}/fixtures/nextup`;
    const response = await axios.get(endpoint);
    if (category) {
      return response.data.data.filter((x: any) => x.category === category);
    } else {
      return response.data.data;
    }
  } catch (error: any) {
    console.error('Error fetching schedule:', error?.code);
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
    const team1 = { name: name1, goals: getRandomInt(6), points: getRandomInt(23), category };
    const team2 = { name: name2, goals: getRandomInt(6), points: getRandomInt(23), category };
    return { team1: team1, team2: team2 };
  };
  const { tournamentId, matchId, team1, team2, category } = fixture;
  try {
    await axios.get(`${API}/${tournamentId}/fixtures/${matchId}/start`);
    const data = generateTeamData(team1, team2, category);
    await axios.post(`${API}/${tournamentId}/fixtures/${matchId}/score`, data);
  } catch (error: any) {
    console.error('Error playing match:', error?.code);
  }
};

export const getFixtures = async (
  id: number
): Promise<any> => {  // Changed return type to any for consistency
  const endpoint = `${API}/${id}/fixtures`;
  const response = await axios.get(endpoint);
  return response.data.data;
};

// New function to fetch all tournaments
export const getTournaments = async (): Promise<any> => {
  try {
    const endpoint = `${API}`;
    const response = await axios.get(endpoint);
    return response.data.data;  // Assumes API returns { data: [...] }
  } catch (error: any) {
    console.error('Error fetching tournaments:', error?.code);
    return [];
  }
};
