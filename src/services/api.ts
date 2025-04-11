
import axios from 'axios';
import { Anime, Genre } from './animeData';

const API_URL = 'http://localhost:8000/api'; // Django backend URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchAnimeList = async (): Promise<Anime[]> => {
  try {
    const response = await api.get('/anime/');
    return response.data;
  } catch (error) {
    console.error('Error fetching anime list:', error);
    // Fall back to mock data
    const { animeData } = await import('./animeData');
    return animeData;
  }
};

export const fetchAnimeById = async (id: number): Promise<Anime | undefined> => {
  try {
    const response = await api.get(`/anime/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching anime with id ${id}:`, error);
    // Fall back to mock data
    const { getAnimeById } = await import('./animeData');
    return getAnimeById(id);
  }
};

export const fetchGenres = async (): Promise<Genre[]> => {
  try {
    const response = await api.get('/genres/');
    return response.data;
  } catch (error) {
    console.error('Error fetching genres:', error);
    // Fall back to mock data
    const { genres } = await import('./animeData');
    return genres;
  }
};

export const searchAnimeByQuery = async (query: string): Promise<Anime[]> => {
  try {
    const response = await api.get(`/anime/search/?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error('Error searching anime:', error);
    // Fall back to mock data
    const { searchAnime } = await import('./animeData');
    return searchAnime(query);
  }
};

export const getAnimeRecommendations = async (
  selectedGenres: string[] = [],
  selectedType: string = '',
  animeId: number = 0
): Promise<Anime[]> => {
  try {
    let url = '/anime/recommendations/';
    const params = new URLSearchParams();
    
    if (selectedGenres.length > 0) {
      selectedGenres.forEach(genre => params.append('genres', genre));
    }
    
    if (selectedType) {
      params.append('type', selectedType);
    }
    
    if (animeId > 0) {
      params.append('anime_id', animeId.toString());
    }
    
    const response = await api.get(`${url}?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    // Fall back to mock data
    const { getRecommendations } = await import('./animeData');
    return getRecommendations(selectedGenres, selectedType, animeId);
  }
};
