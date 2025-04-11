
import axios from 'axios';
import { Anime, Genre, UserProfile, Comment, Rating } from './types';

const API_URL = 'http://localhost:8000/api'; // Django backend URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth token configuration
export const setAuthToken = (token: string) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

// Initialize token from localStorage
const token = localStorage.getItem('token');
if (token) {
  setAuthToken(token);
}

// Authentication APIs
export const loginUser = async (username: string, password: string) => {
  try {
    const response = await api.post('/auth/login/', { username, password });
    setAuthToken(response.data.token);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const registerUser = async (username: string, email: string, password: string) => {
  try {
    const response = await api.post('/auth/register/', { username, email, password });
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const logoutUser = () => {
  setAuthToken('');
};

// Anime APIs
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

// User Profile APIs
export const fetchUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await api.get('/users/profile/');
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (profileData: Partial<UserProfile>): Promise<UserProfile> => {
  try {
    const response = await api.put('/users/profile/', profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Watchlist APIs
export const fetchWatchlist = async (): Promise<Anime[]> => {
  try {
    const response = await api.get('/users/watchlist/');
    return response.data;
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    return [];
  }
};

export const addToWatchlist = async (animeId: number): Promise<void> => {
  try {
    await api.post('/users/watchlist/add/', { anime_id: animeId });
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    throw error;
  }
};

export const removeFromWatchlist = async (animeId: number): Promise<void> => {
  try {
    await api.delete(`/users/watchlist/remove/${animeId}/`);
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    throw error;
  }
};

export const isInWatchlist = async (animeId: number): Promise<boolean> => {
  try {
    const response = await api.get(`/users/watchlist/check/${animeId}/`);
    return response.data.in_watchlist;
  } catch (error) {
    console.error('Error checking watchlist:', error);
    return false;
  }
};

// Ratings APIs
export const fetchAnimeRatings = async (animeId: number): Promise<Rating[]> => {
  try {
    const response = await api.get(`/anime/${animeId}/ratings/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching anime ratings:', error);
    return [];
  }
};

export const rateAnime = async (animeId: number, score: number): Promise<void> => {
  try {
    await api.post(`/anime/${animeId}/rate/`, { score });
  } catch (error) {
    console.error('Error rating anime:', error);
    throw error;
  }
};

export const getUserRating = async (animeId: number): Promise<number | null> => {
  try {
    const response = await api.get(`/anime/${animeId}/user-rating/`);
    return response.data.score;
  } catch (error) {
    console.error('Error fetching user rating:', error);
    return null;
  }
};

// Comments/Reviews APIs
export const fetchAnimeComments = async (animeId: number): Promise<Comment[]> => {
  try {
    const response = await api.get(`/anime/${animeId}/comments/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching anime comments:', error);
    return [];
  }
};

export const postComment = async (animeId: number, content: string): Promise<Comment> => {
  try {
    const response = await api.post(`/anime/${animeId}/comments/add/`, { content });
    return response.data;
  } catch (error) {
    console.error('Error posting comment:', error);
    throw error;
  }
};

export const fetchTrendingAnime = async (): Promise<Anime[]> => {
  try {
    const response = await api.get('/anime/trending/');
    return response.data;
  } catch (error) {
    console.error('Error fetching trending anime:', error);
    // Fall back to mock data - return top rated as trending
    const { animeData } = await import('./animeData');
    return [...animeData].sort((a, b) => b.rating - a.rating).slice(0, 5);
  }
};
