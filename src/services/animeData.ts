// This is a mock database for our anime recommendation system
// In a real app, this would be fetched from a backend API

export interface Anime {
  id: number;
  title: string;
  image: string;
  synopsis: string;
  type: 'TV' | 'Movie' | 'OVA' | 'Special';
  episodes: number;
  year: number;
  season: 'Winter' | 'Spring' | 'Summer' | 'Fall';
  genres: string[];
  rating: number;
  studios: string[];
}

export interface Genre {
  id: string;
  name: string;
}

export const genres: Genre[] = [
  { id: 'action', name: 'Action' },
  { id: 'adventure', name: 'Adventure' },
  { id: 'comedy', name: 'Comedy' },
  { id: 'drama', name: 'Drama' },
  { id: 'fantasy', name: 'Fantasy' },
  { id: 'horror', name: 'Horror' },
  { id: 'mecha', name: 'Mecha' },
  { id: 'music', name: 'Music' },
  { id: 'mystery', name: 'Mystery' },
  { id: 'psychological', name: 'Psychological' },
  { id: 'romance', name: 'Romance' },
  { id: 'sci-fi', name: 'Sci-Fi' },
  { id: 'slice-of-life', name: 'Slice of Life' },
  { id: 'sports', name: 'Sports' },
  { id: 'supernatural', name: 'Supernatural' },
  { id: 'thriller', name: 'Thriller' },
];

export const animeData: Anime[] = [
  {
    id: 1,
    title: 'Attack on Titan',
    image: 'https://cdn.myanimelist.net/images/anime/1323/120926.jpg',
    synopsis: 'After his hometown is destroyed and his mother is killed, young Eren Yeager vows to cleanse the earth of the giant humanoid Titans that have brought humanity to the brink of extinction.',
    type: 'TV',
    episodes: 75,
    year: 2013,
    season: 'Spring',
    genres: ['Action', 'Drama', 'Fantasy', 'Mystery'],
    rating: 9.1,
    studios: ['MAPPA', 'Wit Studio']
  },
  {
    id: 2,
    title: 'Demon Slayer',
    image: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg',
    synopsis: 'A family is attacked by demons and only two members survive - Tanjiro and his sister Nezuko, who is turning into a demon slowly. Tanjiro sets out to become a demon slayer to avenge his family and cure his sister.',
    type: 'TV',
    episodes: 26,
    year: 2019,
    season: 'Spring',
    genres: ['Action', 'Fantasy', 'Supernatural'],
    rating: 8.5,
    studios: ['ufotable']
  },
  {
    id: 3,
    title: 'My Hero Academia',
    image: 'https://cdn.myanimelist.net/images/anime/1170/124312.jpg',
    synopsis: 'In a world where people with superpowers (known as "Quirks") are the norm, middle school student Izuku Midoriya has dreams of one day becoming a Hero, despite being bullied by his classmates for not having a Quirk.',
    type: 'TV',
    episodes: 113,
    year: 2016,
    season: 'Spring',
    genres: ['Action', 'Comedy', 'Supernatural'],
    rating: 8.2,
    studios: ['Bones']
  },
  {
    id: 4,
    title: 'Your Name',
    image: 'https://cdn.myanimelist.net/images/anime/5/87048.jpg',
    synopsis: 'Two strangers find themselves linked in a bizarre way. When a connection forms, will distance be the only thing to keep them apart?',
    type: 'Movie',
    episodes: 1,
    year: 2016,
    season: 'Summer',
    genres: ['Drama', 'Romance', 'Supernatural'],
    rating: 9.0,
    studios: ['CoMix Wave Films']
  },
  {
    id: 5,
    title: 'One Punch Man',
    image: 'https://cdn.myanimelist.net/images/anime/12/76049.jpg',
    synopsis: 'The story of Saitama, a hero who is a hero for fun & can defeat any enemy with one punch. But being the strongest has left him bored and unfulfilled.',
    type: 'TV',
    episodes: 12,
    year: 2015,
    season: 'Fall',
    genres: ['Action', 'Comedy', 'Sci-Fi'],
    rating: 8.7,
    studios: ['Madhouse']
  },
  {
    id: 6,
    title: 'Spirited Away',
    image: 'https://cdn.myanimelist.net/images/anime/6/79597.jpg',
    synopsis: 'During her family\'s move to the suburbs, Chihiro wanders into a world ruled by gods, witches, and spirits, where humans are transformed into beasts.',
    type: 'Movie',
    episodes: 1,
    year: 2001,
    season: 'Summer',
    genres: ['Adventure', 'Fantasy', 'Supernatural'],
    rating: 8.9,
    studios: ['Studio Ghibli']
  },
  {
    id: 7,
    title: 'Death Note',
    image: 'https://cdn.myanimelist.net/images/anime/9/9453.jpg',
    synopsis: 'A high school student discovers a supernatural notebook that grants its user the ability to kill anyone whose name is written in its pages.',
    type: 'TV',
    episodes: 37,
    year: 2006,
    season: 'Fall',
    genres: ['Mystery', 'Psychological', 'Supernatural', 'Thriller'],
    rating: 8.6,
    studios: ['Madhouse']
  },
  {
    id: 8,
    title: 'Violet Evergarden',
    image: 'https://cdn.myanimelist.net/images/anime/1795/95088.jpg',
    synopsis: 'A young girl formerly known as "the weapon" has left the battlefield to start a new life at CH Postal Service. There, she begins to understand the meaning of the words "I love you."',
    type: 'TV',
    episodes: 13,
    year: 2018,
    season: 'Winter',
    genres: ['Drama', 'Fantasy', 'Slice of Life'],
    rating: 8.7,
    studios: ['Kyoto Animation']
  },
  {
    id: 9,
    title: 'Jujutsu Kaisen',
    image: 'https://cdn.myanimelist.net/images/anime/1171/109222.jpg',
    synopsis: 'A boy swallows a cursed talisman - the finger of a demon - and becomes cursed himself. He enters a shaman\'s school to be able to locate the demon\'s other body parts and thus exorcise himself.',
    type: 'TV',
    episodes: 24,
    year: 2020,
    season: 'Fall',
    genres: ['Action', 'Fantasy', 'Supernatural'],
    rating: 8.7,
    studios: ['MAPPA']
  },
  {
    id: 10,
    title: 'Fullmetal Alchemist: Brotherhood',
    image: 'https://cdn.myanimelist.net/images/anime/1223/96541.jpg',
    synopsis: 'Two brothers search for a Philosopher\'s Stone after an attempt to revive their deceased mother goes wrong, leaving them in damaged physical forms.',
    type: 'TV',
    episodes: 64,
    year: 2009,
    season: 'Spring',
    genres: ['Action', 'Adventure', 'Drama', 'Fantasy'],
    rating: 9.2,
    studios: ['Bones']
  },
  {
    id: 11,
    title: 'Steins;Gate',
    image: 'https://cdn.myanimelist.net/images/anime/5/73199.jpg',
    synopsis: 'A group of friends create a device that can send messages to the past, altering the flow of history and leading to unforeseen consequences.',
    type: 'TV',
    episodes: 24,
    year: 2011,
    season: 'Spring',
    genres: ['Drama', 'Sci-Fi', 'Thriller'],
    rating: 9.1,
    studios: ['White Fox']
  },
  {
    id: 12,
    title: 'Cowboy Bebop',
    image: 'https://cdn.myanimelist.net/images/anime/4/19644.jpg',
    synopsis: 'A ragtag crew of bounty hunters chases down the galaxy\'s most dangerous criminals. They\'ll save the world... for the right price.',
    type: 'TV',
    episodes: 26,
    year: 1998,
    season: 'Spring',
    genres: ['Action', 'Adventure', 'Drama', 'Sci-Fi'],
    rating: 8.8,
    studios: ['Sunrise']
  },
];

export const getAnimeById = (id: number): Anime | undefined => {
  return animeData.find((anime) => anime.id === id);
};

export const searchAnime = (query: string): Anime[] => {
  const lowerQuery = query.toLowerCase();
  return animeData.filter((anime) => 
    anime.title.toLowerCase().includes(lowerQuery) ||
    anime.genres.some((genre) => genre.toLowerCase().includes(lowerQuery)) ||
    anime.studios.some((studio) => studio.toLowerCase().includes(lowerQuery))
  );
};

export const getRecommendations = (
  selectedGenres: string[] = [], 
  selectedType: string = '',
  animeId: number = 0
): Anime[] => {
  let recommendations: Anime[] = [];
  
  // If we have an animeId, base recommendations on similar anime
  if (animeId > 0) {
    const sourceAnime = getAnimeById(animeId);
    if (sourceAnime) {
      recommendations = animeData
        .filter((anime) => anime.id !== animeId)
        .filter((anime) => {
          const genreMatch = anime.genres.some(genre => 
            sourceAnime.genres.includes(genre)
          );
          const studioMatch = anime.studios.some(studio => 
            sourceAnime.studios.includes(studio)
          );
          return genreMatch || studioMatch;
        })
        .sort((a, b) => {
          // Count common genres
          const genresA = a.genres.filter(genre => sourceAnime.genres.includes(genre)).length;
          const genresB = b.genres.filter(genre => sourceAnime.genres.includes(genre)).length;
          
          // Combine with rating for sorting
          return (genresB + b.rating/10) - (genresA + a.rating/10);
        })
        .slice(0, 5);
    }
  } 
  // Otherwise filter by selected genres and type
  else {
    recommendations = animeData.filter((anime) => {
      const genreMatch = selectedGenres.length === 0 || 
        selectedGenres.every(genre => 
          anime.genres.some(g => g.toLowerCase() === genre.toLowerCase())
        );
      
      const typeMatch = selectedType === '' || anime.type === selectedType;
      
      return genreMatch && typeMatch;
    });
  }

  // Ensure we return maximum 8 recommendations
  return recommendations.slice(0, 8);
};
