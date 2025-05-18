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

export const fetchMatchesByMatchday = async (matchday) => {
  const response = await api.get(`/matches/matchday/${matchday}`);
  return response.data;
};

export const fetchMatchesByStadiumId = async (stadiumId) => {
  const response = await api.get(`/matches/stadium/${stadiumId}`);
  return response.data;
};

export const fetchMatchesByStatus = async (status) => {
  const response = await api.get(`/matches/status/${status}`);
  return response.data;
};

export const fetchMatchesByDateRange = async (startDate, endDate) => {
  const response = await api.get('/matches/date-range', {
    params: { startDate, endDate }
  });
  return response.data;
};

export const fetchMatchesWithFilters = async (filters) => {
  const response = await api.get('/matches/filters', {
    params: filters
  });
  return response.data;
};

// Stadiums API
export const fetchStadiums = async () => {
  const response = await api.get('/stadiums');
  return response.data;
};

export default api;