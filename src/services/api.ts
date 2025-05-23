import axios, { AxiosError } from 'axios';
import { Anime, Genre, Comment, Rating, CharacterData, UserProfile } from './types';
import { mockAnimeList, mockTrendingAnime, mockGenres, mockComments, mockWatchlist, mockCharacters, fetchRealAnimeData, searchRealAnime, fetchRealTrendingAnime } from './mockData';

// Toggle this to false to use real API calls instead of mock data for backend features
// Always default to true to ensure the application works without a backend
const USE_MOCK_DATA = true;

// Always use real API for anime data
const USE_REAL_ANIME_DATA = true;

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
      error: error.message
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

// Helper function to handle API calls with mock data fallback
const safeApiCall = async <T>(
  apiCallFn: () => Promise<T>, 
  mockData: T, 
  errorMsg: string = "API request failed"
): Promise<T> => {
  if (USE_MOCK_DATA) {
    console.log('Using mock data instead of API call');
    return mockData;
  }
  
  try {
    return await apiCallFn();
  } catch (error) {
    console.error(errorMsg, error);
    
    // If backend is unavailable, use mock data as fallback
    console.log('Backend unavailable. Using mock data as fallback.');
    return mockData;
  }
};

// Authentication APIs
export const loginUser = async (username: string, password: string) => {
  // Only try API if mock data is disabled
  if (!USE_MOCK_DATA) {
    try {
      const response = await api.post('/auth/login/', { username, password });
      setAuthToken(response.data.access);
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }
  
  // Mock login response
  console.log('Using mock login data');
  const mockToken = "mock_jwt_token_for_testing";
  setAuthToken(mockToken);
  return { access: mockToken, refresh: "mock_refresh_token" };
};

export const registerUser = async (username: string, email: string, password: string) => {
  if (!USE_MOCK_DATA) {
    try {
      const response = await api.post('/auth/register/', { username, email, password });
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }
  
  console.log('Using mock registration data');
  return { success: true, message: "User registered successfully" };
};

export const logoutUser = () => {
  setAuthToken('');
  console.log('User logged out');
};

// Anime APIs
export const fetchAnimeList = async (): Promise<Anime[]> => {
  if (USE_REAL_ANIME_DATA) {
    try {
      return await fetchRealAnimeData();
    } catch (error) {
      console.error('Error fetching anime list:', error);
      return mockAnimeList;
    }
  }
  
  return safeApiCall(
    async () => {
      const response = await api.get('/anime/');
      return response.data;
    },
    mockAnimeList,
    'Error fetching anime list:'
  );
};

export const fetchAnimeById = async (id: number): Promise<Anime> => {
  if (USE_REAL_ANIME_DATA) {
    try {
      // First look for the anime in our real data cache
      const allAnime = await fetchRealAnimeData();
      const anime = allAnime.find(a => a.id === id);
      
      if (anime) {
        console.log(`Found anime with id ${id} in cache:`, anime.title);
        return anime;
      } else {
        console.log(`Anime with id ${id} not found in cache, fetching individually...`);
        // If not found in cache, try to fetch it individually
        // This might not be needed with the current implementation but is a good fallback
        const animeList = await fetchRealAnimeData();
        // Try to find the anime again with the fresh data
        const freshResult = animeList.find(a => a.id === id);
        
        if (freshResult) {
          return freshResult;
        }
      }
    } catch (error) {
      console.error(`Error fetching anime with id ${id}:`, error);
    }
  }
  
  return safeApiCall(
    async () => {
      const response = await api.get(`/anime/${id}/`);
      return response.data;
    },
    mockAnimeList.find(anime => anime.id === id) || {
      id: id,
      title: "Sample Anime",
      synopsis: "This is a sample anime description.",
      type: "TV",
      episodes: 12,
      year: 2023,
      season: "Spring",
      genres: ["Action"],
      rating: 7.5,
      image: "https://cdn.myanimelist.net/images/anime/1972/138231.jpg",
      studios: ["Sample Studio"]
    },
    `Error fetching anime with id ${id}:`
  );
};

export const fetchGenres = async (): Promise<Genre[]> => {
  return safeApiCall(
    async () => {
      const response = await api.get('/genres/');
      return response.data;
    },
    mockGenres,
    'Error fetching genres:'
  );
};

export const searchAnimeByQuery = async (query: string): Promise<Anime[]> => {
  if (!query.trim()) {
    return [];
  }
  
  if (USE_REAL_ANIME_DATA) {
    try {
      return await searchRealAnime(query);
    } catch (error) {
      console.error('Error searching anime:', error);
    }
  }
  
  return safeApiCall(
    async () => {
      const response = await api.get(`/anime/search/?q=${encodeURIComponent(query)}`);
      return response.data;
    },
    mockAnimeList.filter(anime => 
      anime.title.toLowerCase().includes(query.toLowerCase())
    ),
    'Error searching anime:'
  );
};

export const getAnimeRecommendations = async (
  selectedGenres: string[] = [],
  selectedType: string = '',
  animeId: number = 0
): Promise<Anime[]> => {
  const MAX_RECOMMENDATIONS = 15;
  
  if (USE_REAL_ANIME_DATA) {
    try {
      // Fetch all anime data first
      const allAnime = await fetchRealAnimeData();
      
      // If animeId is provided, base recommendations on similar anime
      if (animeId > 0) {
        const sourceAnime = allAnime.find(anime => anime.id === animeId);
        
        if (sourceAnime) {
          console.log(`Generating AI recommendations for anime: ${sourceAnime.title}`);
          
          // Calculate similarity scores based on genres, type, and rating
          const scoredAnime = allAnime
            .filter(anime => anime.id !== animeId) // Exclude the source anime
            .map(anime => {
              // Count matching genres
              const matchingGenres = sourceAnime.genres.filter(genre => 
                anime.genres.includes(genre)
              ).length;
              
              // Boost score if type matches
              const typeMatch = anime.type === sourceAnime.type ? 2 : 0;
              
              // Rating similarity (closer ratings get higher scores)
              const ratingDiff = 10 - Math.abs(anime.rating - sourceAnime.rating);
              
              // Studio match bonus
              const studioMatch = anime.studios.some(studio => 
                sourceAnime.studios.includes(studio)
              ) ? 3 : 0;
              
              // Year proximity bonus (newer anime within 3 years get a boost)
              const yearProximity = Math.abs(anime.year - sourceAnime.year) <= 3 ? 1 : 0;
              
              // Calculate total similarity score
              const similarityScore = 
                (matchingGenres * 5) + typeMatch + (ratingDiff * 0.5) + studioMatch + yearProximity;
                
              return { anime, score: similarityScore };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, MAX_RECOMMENDATIONS)
            .map(item => item.anime);
          
          console.log(`Found ${scoredAnime.length} recommendations for ${sourceAnime.title}`);
          return scoredAnime;
        }
      }
      
      // If we're filtering by genres and type
      let filteredAnime = [...allAnime];
      
      // Filter by genres if selected
      if (selectedGenres.length > 0) {
        filteredAnime = filteredAnime.filter(anime => 
          selectedGenres.every(selectedGenre => 
            anime.genres.some(genre => 
              genre.toLowerCase().includes(selectedGenre.toLowerCase())
            )
          )
        );
      }
      
      // Filter by type if selected
      if (selectedType && selectedType !== 'all') {
        filteredAnime = filteredAnime.filter(anime => anime.type === selectedType);
      }
      
      // Sort by rating for best recommendations
      filteredAnime.sort((a, b) => b.rating - a.rating);
      
      return filteredAnime.slice(0, MAX_RECOMMENDATIONS);
    } catch (error) {
      console.error('Error generating AI recommendations:', error);
    }
  }
  
  // Fall back to original implementation
  return safeApiCall(
    async () => {
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
    },
    mockAnimeList.filter(anime => 
      (selectedGenres.length === 0 || anime.genres.some(genre => selectedGenres.includes(genre))) &&
      (selectedType === '' || anime.type === selectedType)
    ).slice(0, 5),
    'Error fetching recommendations:'
  );
};

// User Profile APIs
export const fetchUserProfile = async (): Promise<UserProfile> => {
  return safeApiCall(
    async () => {
      const response = await api.get('/auth/profile/');
      return response.data;
    },
    {
      id: 1,
      username: "anime_lover",
      email: "user@example.com",
      bio: "Just a mock profile for development",
      joined_date: new Date().toISOString(),
      favorite_genres: ["Action", "Adventure"]
    },
    'Error fetching user profile:'
  );
};

export const updateUserProfile = async (profileData: Partial<UserProfile>): Promise<UserProfile> => {
  const response = await api.put('/auth/profile/', profileData);
  return response.data;
};

// Watchlist APIs
export const fetchWatchlist = async (): Promise<Anime[]> => {
  return safeApiCall(
    async () => {
      const response = await api.get('/auth/watchlist/');
      return response.data.map((item: any) => item.anime);
    },
    mockWatchlist,
    'Error fetching watchlist:'
  );
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
  if (USE_REAL_ANIME_DATA) {
    try {
      return await fetchRealTrendingAnime();
    } catch (error) {
      console.error('Error fetching trending anime:', error);
      return mockTrendingAnime;
    }
  }
  
  return safeApiCall(
    async () => {
      const response = await api.get('/anime/trending/');
      return response.data;
    },
    mockTrendingAnime,
    'Error fetching trending anime:'
  );
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

// Character APIs
export const fetchAnimeCharacters = async (animeId: number): Promise<CharacterData[]> => {
  return safeApiCall(
    async () => {
      const response = await api.get(`/anime/${animeId}/characters/`);
      return response.data;
    },
    mockCharacters.filter(character => character.anime_id === animeId),
    `Error fetching characters for anime with id ${animeId}:`
  );
};
