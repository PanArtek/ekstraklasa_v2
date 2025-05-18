import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchLeagueTable, updateLeagueTable, resetTeamStats } from '../services/api';

/**
 * Hook do pobierania tabeli ligowej
 * @param {Object} options - Opcje zapytania
 * @param {string} options.season - Sezon (np. '2024/2025')
 * @returns {Object} React Query result object
 */
export const useLeagueTable = (options = {}) => {
  return useQuery({
    queryKey: ['leagueTable', options.season],
    queryFn: () => fetchLeagueTable(options),
    staleTime: 5 * 60 * 1000, // 5 minut
  });
};

/**
 * Hook do aktualizacji tabeli ligowej
 * @returns {Object} React Query mutation object
 */
export const useUpdateLeagueTable = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (season) => updateLeagueTable(season),
    onSuccess: (data, variables) => {
      // Aktualizuj pamięć podręczną po udanej mutacji
      queryClient.invalidateQueries({ queryKey: ['leagueTable'] });
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      
      // Bezpośrednio aktualizujemy pamięć podręczną tabeli
      queryClient.setQueryData(['leagueTable', variables], data.table);
    },
  });
};

/**
 * Hook do resetowania statystyk drużyn
 * @returns {Object} React Query mutation object
 */
export const useResetTeamStats = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: resetTeamStats,
    onSuccess: () => {
      // Aktualizuj pamięć podręczną po udanej mutacji
      queryClient.invalidateQueries({ queryKey: ['leagueTable'] });
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
};

export default useLeagueTable;