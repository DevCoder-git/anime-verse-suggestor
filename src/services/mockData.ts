
import { Anime } from './animeData';
import axios from 'axios';
import { JikanAnimeResponse, JikanAnime } from './jikanTypes';

const JIKAN_API_BASE = 'https://api.jikan.moe/v4';

// Convert Jikan anime to our app's anime format
const convertJikanAnime = (jikanAnime: JikanAnime): Anime => ({
  id: jikanAnime.mal_id,
  title: jikanAnime.title,
  synopsis: jikanAnime.synopsis,
  type: convertAnimeType(jikanAnime.type),
  episodes: jikanAnime.episodes,
  year: jikanAnime.year,
  season: convertAnimeSeason(jikanAnime.season),
  genres: jikanAnime.genres.map(g => g.name),
  rating: jikanAnime.score,
  image: jikanAnime.images.jpg.large_image_url,
  studios: jikanAnime.studios.map(s => s.name)
});

// Convert string to valid anime type
const convertAnimeType = (type: string): 'TV' | 'Movie' | 'OVA' | 'Special' => {
  if (type === 'TV' || type === 'Movie' || type === 'OVA' || type === 'Special') {
    return type;
  }
  return 'TV';
};

// Convert string to valid season
const convertAnimeSeason = (season?: string): 'Winter' | 'Spring' | 'Summer' | 'Fall' => {
  if (season === 'Winter' || season === 'Spring' || season === 'Summer' || season === 'Fall') {
    return season;
  }
  return 'Spring';
};

// Create placeholder mock data for fallbacks
export const mockAnimeList: Anime[] = [];
export const mockTrendingAnime: Anime[] = [];
export const mockGenres = [
  { id: "1", name: "Action" },
  { id: "2", name: "Adventure" },
  { id: "3", name: "Comedy" },
  { id: "4", name: "Drama" },
  { id: "5", name: "Fantasy" }
];
export const mockComments = [];
export const mockWatchlist: Anime[] = [];
export const mockCharacters = [];

// Fetch real anime data from Jikan API
export const fetchRealAnimeData = async (): Promise<Anime[]> => {
  console.log('Fetching real anime data from Jikan API...');
  try {
    const response = await axios.get<JikanAnimeResponse>(`${JIKAN_API_BASE}/top/anime?limit=24`);
    return response.data.data.map(convertJikanAnime);
  } catch (error) {
    console.error('Error fetching anime data from Jikan API:', error);
    return [];
  }
};

// Search anime using Jikan API
export const searchRealAnime = async (query: string): Promise<Anime[]> => {
  if (!query.trim()) return [];
  
  console.log(`Searching anime with query: ${query}`);
  try {
    const response = await axios.get<JikanAnimeResponse>(
      `${JIKAN_API_BASE}/anime?q=${encodeURIComponent(query)}&limit=24`
    );
    return response.data.data.map(convertJikanAnime);
  } catch (error) {
    console.error('Error searching anime with Jikan API:', error);
    return [];
  }
};

// Fetch trending anime using Jikan API
export const fetchRealTrendingAnime = async (): Promise<Anime[]> => {
  console.log('Fetching trending anime data from Jikan API...');
  try {
    // For trending, we'll use the popular endpoint with a small limit
    const response = await axios.get<JikanAnimeResponse>(`${JIKAN_API_BASE}/anime?order_by=popularity&limit=5`);
    return response.data.data.map(convertJikanAnime);
  } catch (error) {
    console.error('Error fetching trending anime from Jikan API:', error);
    return [];
  }
};
