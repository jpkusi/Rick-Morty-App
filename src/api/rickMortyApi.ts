import { Character, ApiResponse, Episode } from '../types/character';

const BASE_URL = 'https://rickandmortyapi.com/api';

export const fetchCharacters = async (page: number = 1): Promise<ApiResponse<Character>> => {
  const response = await fetch(`${BASE_URL}/character?page=${page}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch characters: ${response.statusText}`);
  }
  
  return response.json();
};

export const fetchCharacter = async (id: number): Promise<Character> => {
  const response = await fetch(`${BASE_URL}/character/${id}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch character: ${response.statusText}`);
  }
  
  return response.json();
};

export const fetchEpisode = async (url: string): Promise<Episode> => {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch episode: ${response.statusText}`);
  }
  
  return response.json();
};

export const fetchMultipleEpisodes = async (urls: string[]): Promise<Episode[]> => {
  const promises = urls.slice(0, 5).map(url => fetchEpisode(url)); // Limit to first 5 episodes
  return Promise.all(promises);
};