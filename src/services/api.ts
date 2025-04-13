import axios, { AxiosError } from 'axios';
import { Anime, Genre, UserProfile, Comment, Rating } from './types';

const API_URL = 'http://localhost:8000/api'; // Django backend URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Add timeout to prevent hanging requests
});

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Log detailed error info
    console.error('API Request Failed:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data,
    });
    
    return Promise.reject(error);
  }
);

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
  const response = await api.post('/auth/login/', { username, password });
  setAuthToken(response.data.access);
  return response.data;
};

export const registerUser = async (username: string, email: string, password: string) => {
  const response = await api.post('/auth/register/', { username, email, password });
  return response.data;
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
    const errorMessage = error instanceof AxiosError 
      ? `Server error: ${error.response?.status || 'unknown'} - ${error.response?.statusText || error.message}`
      : 'Failed to connect to the server';
    
    throw new Error(errorMessage);
  }
};

export const fetchAnimeById = async (id: number): Promise<Anime> => {
  const response = await api.get(`/anime/${id}/`);
  return response.data;
};

export const fetchGenres = async (): Promise<Genre[]> => {
  const response = await api.get('/genres/');
  return response.data;
};

export const searchAnimeByQuery = async (query: string): Promise<Anime[]> => {
  try {
    const response = await api.get(`/anime/search/?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error('Error searching anime:', error);
    const errorMessage = error instanceof AxiosError 
      ? `Search failed: ${error.response?.status || 'unknown'} - ${error.message}`
      : 'Failed to connect to the search service';
    
    throw new Error(errorMessage);
  }
};

export const getAnimeRecommendations = async (
  selectedGenres: string[] = [],
  selectedType: string = '',
  animeId: number = 0
): Promise<Anime[]> => {
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
};

// User Profile APIs
export const fetchUserProfile = async (): Promise<UserProfile> => {
  const response = await api.get('/auth/profile/');
  return response.data;
};

export const updateUserProfile = async (profileData: Partial<UserProfile>): Promise<UserProfile> => {
  const response = await api.put('/auth/profile/', profileData);
  return response.data;
};

// Watchlist APIs
export const fetchWatchlist = async (): Promise<Anime[]> => {
  const response = await api.get('/auth/watchlist/');
  // Map the response to extract the anime objects from the watchlist items
  return response.data.map((item: any) => item.anime);
};

export const addToWatchlist = async (animeId: number): Promise<void> => {
  await api.post('/auth/watchlist/add/', { anime_id: animeId });
};

export const removeFromWatchlist = async (animeId: number): Promise<void> => {
  await api.delete(`/auth/watchlist/remove/${animeId}/`);
};

export const isInWatchlist = async (animeId: number): Promise<boolean> => {
  const response = await api.get(`/auth/watchlist/check/${animeId}/`);
  return response.data.in_watchlist;
};

// Ratings APIs
export const fetchAnimeRatings = async (animeId: number): Promise<Rating[]> => {
  const response = await api.get(`/anime/${animeId}/ratings/`);
  return response.data;
};

export const rateAnime = async (animeId: number, score: number): Promise<void> => {
  await api.post(`/anime/${animeId}/rate/`, { score });
};

export const getUserRating = async (animeId: number): Promise<number | null> => {
  const response = await api.get(`/anime/${animeId}/user-rating/`);
  return response.data.score;
};

// Comments/Reviews APIs
export const fetchAnimeComments = async (animeId: number): Promise<Comment[]> => {
  const response = await api.get(`/anime/${animeId}/comments/`);
  return response.data;
};

export const postComment = async (animeId: number, content: string): Promise<Comment> => {
  const response = await api.post(`/anime/${animeId}/comments/add/`, { content });
  return response.data;
};

export const reportComment = async (commentId: number): Promise<void> => {
  await api.post(`/auth/comments/report/${commentId}/`);
};

export const fetchTrendingAnime = async (): Promise<Anime[]> => {
  const response = await api.get('/anime/trending/');
  return response.data;
};

// User Statistics API
export const fetchUserStats = async () => {
  const response = await api.get('/auth/user-stats/');
  return response.data;
};

// Admin APIs
export const isAdmin = async (): Promise<boolean> => {
  try {
    await api.get('/auth/admin/check/');
    return true;
  } catch (error) {
    return false;
  }
};

export const fetchAllUsers = async () => {
  const response = await api.get('/auth/admin/users/');
  return response.data.users;
};

export const manageUser = async (userId: number, action: 'activate' | 'deactivate' | 'make_admin' | 'remove_admin') => {
  const response = await api.post('/auth/admin/users/', { user_id: userId, action });
  return response.data;
};

export const fetchReportedContent = async () => {
  const response = await api.get('/auth/admin/moderation/');
  return response.data;
};

export const moderateContent = async (commentId: number, action: 'remove' | 'approve') => {
  const response = await api.post('/auth/admin/moderation/', { comment_id: commentId, action });
  return response.data;
};
