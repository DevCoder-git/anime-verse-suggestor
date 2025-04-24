
import { Anime, Genre } from './animeData';
import { CharacterData, Comment } from './types';

// Sample anime data for testing and development
export const mockAnimeList: Anime[] = [
  {
    id: 1,
    title: "Demon Slayer",
    synopsis: "A boy becomes a demon slayer after his family is slaughtered and his sister is turned into a demon.",
    type: "TV",
    episodes: 26,
    year: 2019,
    season: "Spring",
    genres: ["Action", "Fantasy", "Adventure"],
    rating: 8.9,
    image: "https://i.imgur.com/RF2Pvyk.jpg",
    studios: ["ufotable"]
  },
  {
    id: 2,
    title: "Attack on Titan",
    synopsis: "Humanity fights for survival against man-eating giants called Titans.",
    type: "TV",
    episodes: 86,
    year: 2013,
    season: "Spring",
    genres: ["Action", "Drama", "Fantasy"],
    rating: 9.1,
    image: "https://i.imgur.com/ubBcNvY.jpg",
    studios: ["Wit Studio"]
  },
  {
    id: 3,
    title: "My Hero Academia",
    synopsis: "A boy without superpowers in a world where they are the norm follows his dream of becoming a hero.",
    type: "TV",
    episodes: 114,
    year: 2016,
    season: "Spring",
    genres: ["Action", "Comedy", "Super Power"],
    rating: 8.4,
    image: "https://i.imgur.com/jh2VhKF.jpg",
    studios: ["Bones"]
  },
  {
    id: 4,
    title: "One Punch Man",
    synopsis: "A superhero who can defeat anyone with one punch becomes bored with a lack of challenge.",
    type: "TV",
    episodes: 24,
    year: 2015,
    season: "Fall",
    genres: ["Action", "Comedy", "Sci-Fi"],
    rating: 8.7,
    image: "https://i.imgur.com/hvmRzAp.jpg",
    studios: ["Madhouse"]
  },
  {
    id: 5,
    title: "Jujutsu Kaisen",
    synopsis: "A high schooler joins a secret organization to fight cursed spirits and save his friends.",
    type: "TV",
    episodes: 24,
    year: 2020,
    season: "Fall",
    genres: ["Action", "Fantasy", "Supernatural"],
    rating: 8.8,
    image: "https://i.imgur.com/CT9Lxnz.jpg",
    studios: ["MAPPA"]
  },
  {
    id: 6,
    title: "Fullmetal Alchemist: Brotherhood",
    synopsis: "Two brothers search for the Philosopher's Stone to restore their bodies after a failed alchemical experiment.",
    type: "TV",
    episodes: 64,
    year: 2009,
    season: "Spring",
    genres: ["Action", "Adventure", "Drama"],
    rating: 9.2,
    image: "https://i.imgur.com/hSUVaZM.jpg",
    studios: ["Bones"]
  },
  {
    id: 7,
    title: "Naruto: Shippuden",
    synopsis: "Naruto returns after training to protect the Hidden Leaf Village and pursue Sasuke.",
    type: "TV",
    episodes: 500,
    year: 2007,
    season: "Winter",
    genres: ["Action", "Adventure", "Fantasy"],
    rating: 8.6,
    image: "https://i.imgur.com/0JGgBUj.jpg",
    studios: ["Pierrot"]
  },
  {
    id: 8,
    title: "Death Note",
    synopsis: "A high school student discovers a supernatural notebook that allows him to kill anyone by writing their name.",
    type: "TV",
    episodes: 37,
    year: 2006,
    season: "Fall",
    genres: ["Mystery", "Psychological", "Supernatural"],
    rating: 9.0,
    image: "https://i.imgur.com/PdXDXq4.jpg",
    studios: ["Madhouse"]
  },
  {
    id: 9,
    title: "Hunter x Hunter",
    synopsis: "A young boy takes a dangerous test to become a Hunter like his father.",
    type: "TV",
    episodes: 148,
    year: 2011,
    season: "Fall",
    genres: ["Action", "Adventure", "Fantasy"],
    rating: 9.1,
    image: "https://i.imgur.com/Cj7nD9O.jpg",
    studios: ["Madhouse"]
  },
  {
    id: 10,
    title: "Violet Evergarden",
    synopsis: "A former soldier becomes a letter writer to understand the meaning of her commander's last words.",
    type: "TV",
    episodes: 13,
    year: 2018,
    season: "Winter",
    genres: ["Drama", "Fantasy", "Slice of Life"],
    rating: 8.9,
    image: "https://i.imgur.com/FCFQBCJ.jpg",
    studios: ["Kyoto Animation"]
  }
];

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
