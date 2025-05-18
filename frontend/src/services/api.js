import axios from 'axios';

// Create an Axios instance with the base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
});

// Teams API
export const fetchTeams = async () => {
  const response = await api.get('/teams');
  return response.data;
};

// Matches API
export const fetchAllMatches = async () => {
  const response = await api.get('/matches');
  return response.data;
};

export const fetchMatchesByTeam = async (teamId) => {
  const response = await api.get(`/matches/team/${teamId}`);
  return response.data;
};

export const fetchMatchesByRound = async (round) => {
  const response = await api.get(`/matches/round/${round}`);
  return response.data;
};

// Stadiums API
export const fetchStadiums = async () => {
  const response = await api.get('/stadiums');
  return response.data;
};

export default api;