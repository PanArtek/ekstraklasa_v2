import { useQuery } from '@tanstack/react-query';
import { fetchAllMatches, fetchMatchesByTeam, fetchMatchesByRound } from '../services/api';

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

export default {
  useAllMatches,
  useMatchesByTeam,
  useMatchesByRound,
};