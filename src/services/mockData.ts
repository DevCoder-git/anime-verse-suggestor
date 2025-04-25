import { Anime, Genre } from './animeData';
import { Comment, CharacterData } from './types';
import axios from 'axios';
import { JikanAnimeResponse, JikanAnime } from './jikanTypes';

const JIKAN_API_BASE = 'https://api.jikan.moe/v4';

// Convert Jikan anime to our app's anime format
const convertJikanAnime = (jikanAnime: JikanAnime): Anime => ({
  id: jikanAnime.mal_id,
  title: jikanAnime.title,
  synopsis: jikanAnime.synopsis,
  type: jikanAnime.type,
  episodes: jikanAnime.episodes,
  year: jikanAnime.year,
  season: jikanAnime.season || 'Unknown',
  genres: jikanAnime.genres.map(g => g.name),
  rating: jikanAnime.score,
  image: jikanAnime.images.jpg.large_image_url,
  studios: jikanAnime.studios.map(s => s.name)
});

// Fetch real anime data from Jikan API
export const fetchRealAnimeData = async (): Promise<Anime[]> => {
  try {
    console.log('Fetching real anime data from Jikan API...');
    const response = await axios.get<JikanAnimeResponse>(`${JIKAN_API_BASE}/top/anime?limit=10`);
    return response.data.data.map(convertJikanAnime);
  } catch (error) {
    console.error('Error fetching from Jikan API:', error);
    return mockAnimeList; // Fallback to mock data if API fails
  }
};

// Search anime using Jikan API
export const searchRealAnime = async (query: string): Promise<Anime[]> => {
  if (!query.trim()) return [];
  
  try {
    console.log(`Searching anime with query: ${query}`);
    const response = await axios.get<JikanAnimeResponse>(
      `${JIKAN_API_BASE}/anime?q=${encodeURIComponent(query)}&limit=10`
    );
    return response.data.data.map(convertJikanAnime);
  } catch (error) {
    console.error('Error searching anime:', error);
    // Fallback to mock search
    return mockAnimeList.filter(anime => 
      anime.title.toLowerCase().includes(query.toLowerCase())
    );
  }
};

// Mock trending anime data
export const mockTrendingAnime: Anime[] = mockAnimeList.slice(0, 5);

// Mock genres data
export const mockGenres: Genre[] = [
  { id: "action", name: "Action" },
  { id: "adventure", name: "Adventure" },
  { id: "comedy", name: "Comedy" },
  { id: "drama", name: "Drama" },
  { id: "fantasy", name: "Fantasy" },
  { id: "horror", name: "Horror" },
  { id: "mystery", name: "Mystery" },
  { id: "romance", name: "Romance" },
  { id: "sci-fi", name: "Sci-Fi" },
  { id: "slice-of-life", name: "Slice of Life" },
  { id: "sports", name: "Sports" },
  { id: "supernatural", name: "Supernatural" },
  { id: "thriller", name: "Thriller" }
];

// Mock comments
export const mockComments: Comment[] = [
  {
    id: 1,
    user: { id: 1, username: "anime_fan_1" },
    anime_id: 1,
    content: "This is one of the best anime I've ever watched! The animation is stunning.",
    created_at: "2023-06-15T14:35:00Z"
  },
  {
    id: 2,
    user: { id: 2, username: "otaku_master" },
    anime_id: 1,
    content: "The story is compelling and the characters are well-developed.",
    created_at: "2023-06-16T09:22:00Z"
  }
];

// Mock user watchlist
export const mockWatchlist: Anime[] = mockAnimeList.slice(1, 4);

// Mock character data
export const mockCharacters: CharacterData[] = [
  {
    id: 1,
    name: "Tanjiro Kamado",
    image: "https://i.imgur.com/WGIXEqn.jpg",
    role: "Main Character",
    voice_actor: "Natsuki Hanae",
    anime_id: 1,
    description: "A kind-hearted young man who became a demon slayer to cure his sister and avenge his family."
  },
  {
    id: 2,
    name: "Eren Yeager",
    image: "https://i.imgur.com/QyAjQB3.jpg",
    role: "Main Character",
    voice_actor: "Yuki Kaji",
    anime_id: 2,
    description: "A passionate young man who swore to eliminate all titans after they destroyed his hometown."
  },
  {
    id: 3,
    name: "Nezuko Kamado",
    image: "https://i.imgur.com/SZJnTOQ.jpg",
    role: "Supporting Character",
    voice_actor: "Akari Kitō",
    anime_id: 1,
    description: "Tanjiro's sister who was turned into a demon but retained some of her humanity."
  },
  {
    id: 4,
    name: "Mikasa Ackerman",
    image: "https://i.imgur.com/FQJ8FY9.jpg",
    role: "Main Character",
    voice_actor: "Yui Ishikawa",
    anime_id: 2,
    description: "A highly skilled soldier who is devoted to protecting Eren."
  }
];
