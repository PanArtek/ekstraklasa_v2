import { useQuery } from '@tanstack/react-query';
import { fetchStadiums } from '../services/api';

export const useStadiums = () => {
  return useQuery({
    queryKey: ['stadiums'],
    queryFn: fetchStadiums,
  });
};

export default useStadiums;