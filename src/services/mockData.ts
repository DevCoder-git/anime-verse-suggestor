
import { Anime, Genre, Comment } from './types';

// Sample anime data for testing and development
export const mockAnimeList: Anime[] = [
  {
    id: 1,
    title: "Demon Slayer",
    description: "A boy becomes a demon slayer after his family is slaughtered and his sister is turned into a demon.",
    type: "TV",
    episodes: 26,
    year: 2019,
    rating: 8.9,
    image: "https://via.placeholder.com/300x450?text=Demon+Slayer",
    genres: ["Action", "Fantasy", "Adventure"],
    studio: "ufotable"
  },
  {
    id: 2,
    title: "Attack on Titan",
    description: "Humanity fights for survival against man-eating giants called Titans.",
    type: "TV",
    episodes: 86,
    year: 2013,
    rating: 9.1,
    image: "https://via.placeholder.com/300x450?text=Attack+on+Titan",
    genres: ["Action", "Drama", "Fantasy"],
    studio: "Wit Studio"
  },
  {
    id: 3,
    title: "My Hero Academia",
    description: "A boy without superpowers in a world where they are the norm follows his dream of becoming a hero.",
    type: "TV",
    episodes: 114,
    year: 2016,
    rating: 8.4,
    image: "https://via.placeholder.com/300x450?text=My+Hero+Academia",
    genres: ["Action", "Comedy", "Super Power"],
    studio: "Bones"
  },
  {
    id: 4,
    title: "One Punch Man",
    description: "A superhero who can defeat anyone with one punch becomes bored with a lack of challenge.",
    type: "TV",
    episodes: 24,
    year: 2015,
    rating: 8.7,
    image: "https://via.placeholder.com/300x450?text=One+Punch+Man",
    genres: ["Action", "Comedy", "Sci-Fi"],
    studio: "Madhouse"
  },
  {
    id: 5,
    title: "Jujutsu Kaisen",
    description: "A high schooler joins a secret organization to fight cursed spirits and save his friends.",
    type: "TV",
    episodes: 24,
    year: 2020,
    rating: 8.8,
    image: "https://via.placeholder.com/300x450?text=Jujutsu+Kaisen",
    genres: ["Action", "Fantasy", "Supernatural"],
    studio: "MAPPA"
  },
  {
    id: 6,
    title: "Fullmetal Alchemist: Brotherhood",
    description: "Two brothers search for the Philosopher's Stone to restore their bodies after a failed alchemical experiment.",
    type: "TV",
    episodes: 64,
    year: 2009,
    rating: 9.2,
    image: "https://via.placeholder.com/300x450?text=Fullmetal+Alchemist",
    genres: ["Action", "Adventure", "Drama"],
    studio: "Bones"
  },
  {
    id: 7,
    title: "Naruto: Shippuden",
    description: "Naruto returns after training to protect the Hidden Leaf Village and pursue Sasuke.",
    type: "TV",
    episodes: 500,
    year: 2007,
    rating: 8.6,
    image: "https://via.placeholder.com/300x450?text=Naruto+Shippuden",
    genres: ["Action", "Adventure", "Fantasy"],
    studio: "Pierrot"
  },
  {
    id: 8,
    title: "Death Note",
    description: "A high school student discovers a supernatural notebook that allows him to kill anyone by writing their name.",
    type: "TV",
    episodes: 37,
    year: 2006,
    rating: 9.0,
    image: "https://via.placeholder.com/300x450?text=Death+Note",
    genres: ["Mystery", "Psychological", "Supernatural"],
    studio: "Madhouse"
  },
  {
    id: 9,
    title: "Hunter x Hunter",
    description: "A young boy takes a dangerous test to become a Hunter like his father.",
    type: "TV",
    episodes: 148,
    year: 2011,
    rating: 9.1,
    image: "https://via.placeholder.com/300x450?text=Hunter+x+Hunter",
    genres: ["Action", "Adventure", "Fantasy"],
    studio: "Madhouse"
  },
  {
    id: 10,
    title: "Violet Evergarden",
    description: "A former soldier becomes a letter writer to understand the meaning of her commander's last words.",
    type: "TV",
    episodes: 13,
    year: 2018,
    rating: 8.9,
    image: "https://via.placeholder.com/300x450?text=Violet+Evergarden",
    genres: ["Drama", "Fantasy", "Slice of Life"],
    studio: "Kyoto Animation"
  }
];

// Mock trending anime data
export const mockTrendingAnime: Anime[] = mockAnimeList.slice(0, 5);

// Mock genres data
export const mockGenres: Genre[] = [
  { id: 1, name: "Action" },
  { id: 2, name: "Adventure" },
  { id: 3, name: "Comedy" },
  { id: 4, name: "Drama" },
  { id: 5, name: "Fantasy" },
  { id: 6, name: "Horror" },
  { id: 7, name: "Mystery" },
  { id: 8, name: "Romance" },
  { id: 9, name: "Sci-Fi" },
  { id: 10, name: "Slice of Life" },
  { id: 11, name: "Sports" },
  { id: 12, name: "Supernatural" },
  { id: 13, name: "Thriller" }
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
