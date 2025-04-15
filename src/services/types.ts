
// Re-export existing types from animeData.ts
export type { Anime, Genre } from './animeData';

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  joined_date: string;
  favorite_genres: string[];
}

export interface Comment {
  id: number;
  anime_id: number;
  user: {
    id: number;
    username: string;
    avatar?: string;
  };
  content: string;
  created_at: string;
}

export interface Rating {
  id: number;
  anime_id: number;
  user: {
    id: number;
    username: string;
  };
  score: number;
  created_at: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
}

// Add CharacterData interface definition
export interface CharacterData {
  id: number;
  name: string;
  image: string;
  role: string;
  voice_actor?: string;
  anime_id: number;
  description?: string;
}
