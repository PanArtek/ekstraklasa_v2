import { useQuery } from '@tanstack/react-query';
import { fetchTeams } from '../services/api';

export const useTeams = () => {
  return useQuery({
    queryKey: ['teams'],
    queryFn: fetchTeams,
  });
};

export default useTeams;