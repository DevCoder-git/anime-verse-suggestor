
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

// Fetch real anime data from Jikan API
export const fetchRealAnimeData = async (): Promise<Anime[]> => {
  console.log('Fetching real anime data from Jikan API...');
  const response = await axios.get<JikanAnimeResponse>(`${JIKAN_API_BASE}/top/anime?limit=24`);
  return response.data.data.map(convertJikanAnime);
};

// Search anime using Jikan API
export const searchRealAnime = async (query: string): Promise<Anime[]> => {
  if (!query.trim()) return [];
  
  console.log(`Searching anime with query: ${query}`);
  const response = await axios.get<JikanAnimeResponse>(
    `${JIKAN_API_BASE}/anime?q=${encodeURIComponent(query)}&limit=24`
  );
  return response.data.data.map(convertJikanAnime);
};

