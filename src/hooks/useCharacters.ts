import { useQuery } from '@tanstack/react-query';
import { fetchCharacters } from '../api/rickMortyApi';

export const useCharacters = (page: number) => {
  return useQuery({
    queryKey: ['characters', page],
    queryFn: () => fetchCharacters(page),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};