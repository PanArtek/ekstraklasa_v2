import { useQuery } from '@tanstack/react-query';
import { 
  fetchAllMatches, 
  fetchMatchesByTeam, 
  fetchMatchesByRound,
  fetchMatchesByMatchday,
  fetchMatchesByStadiumId,
  fetchMatchesByStatus,
  fetchMatchesByDateRange,
  fetchMatchesWithFilters
} from '../services/api';

export const useAllMatches = () => {
  return useQuery({
    queryKey: ['matches'],
    queryFn: fetchAllMatches,
  });
};

export const useMatchesByTeam = (teamId) => {
  return useQuery({
    queryKey: ['matches', 'team', teamId],
    queryFn: () => fetchMatchesByTeam(teamId),
    enabled: !!teamId, // Only run the query if teamId is provided
  });
};

export const useMatchesByRound = (round) => {
  return useQuery({
    queryKey: ['matches', 'round', round],
    queryFn: () => fetchMatchesByRound(round),
    enabled: !!round, // Only run the query if round is provided
  });
};

export const useMatchesByMatchday = (matchday) => {
  return useQuery({
    queryKey: ['matches', 'matchday', matchday],
    queryFn: () => fetchMatchesByMatchday(matchday),
    enabled: !!matchday, // Only run the query if matchday is provided
  });
};

export const useMatchesByStadiumId = (stadiumId) => {
  return useQuery({
    queryKey: ['matches', 'stadium', stadiumId],
    queryFn: () => fetchMatchesByStadiumId(stadiumId),
    enabled: !!stadiumId, // Only run the query if stadiumId is provided
  });
};

export const useMatchesByStatus = (status) => {
  return useQuery({
    queryKey: ['matches', 'status', status],
    queryFn: () => fetchMatchesByStatus(status),
    enabled: !!status, // Only run the query if status is provided
  });
};

export const useMatchesByDateRange = (startDate, endDate) => {
  return useQuery({
    queryKey: ['matches', 'dateRange', startDate, endDate],
    queryFn: () => fetchMatchesByDateRange(startDate, endDate),
    enabled: !!(startDate && endDate), // Only run the query if both dates are provided
  });
};

export const useMatchesWithFilters = (filters) => {
  // Create a stable query key from filters
  const queryKey = ['matches', 'filters', 
    filters.teamId, 
    filters.round,
    filters.matchday, 
    filters.stadiumId, 
    filters.status,
    filters.startDate,
    filters.endDate
  ];
  
  // Check if any filter is set
  const hasFilters = Object.values(filters).some(value => !!value);
  
  return useQuery({
    queryKey,
    queryFn: () => fetchMatchesWithFilters(filters),
    enabled: hasFilters, // Only run the query if at least one filter is provided
  });
};