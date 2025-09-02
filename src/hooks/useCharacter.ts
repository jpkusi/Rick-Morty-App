import { useQuery } from '@tanstack/react-query';
import { fetchCharacter, fetchMultipleEpisodes } from '../api/rickMortyApi';

export const useCharacter = (id: number) => {
  return useQuery({
    queryKey: ['character', id],
    queryFn: () => fetchCharacter(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCharacterEpisodes = (episodeUrls: string[]) => {
  return useQuery({
    queryKey: ['episodes', episodeUrls],
    queryFn: () => fetchMultipleEpisodes(episodeUrls),
    enabled: episodeUrls.length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};