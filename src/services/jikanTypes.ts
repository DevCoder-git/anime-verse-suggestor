
export interface JikanAnimeResponse {
  data: JikanAnime[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
  };
}

export interface JikanAnime {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
      large_image_url: string;
    };
  };
  type: string;
  episodes: number;
  year: number;
  season?: string;
  synopsis: string;
  genres: {
    mal_id: number;
    name: string;
  }[];
  studios: {
    mal_id: number;
    name: string;
  }[];
  score: number;
}
