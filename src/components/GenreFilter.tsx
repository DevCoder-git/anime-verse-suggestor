
import React from 'react';
import { genres } from '@/services/animeData';
import { Badge } from '@/components/ui/badge';

interface GenreFilterProps {
  selectedGenres: string[];
  onGenreSelect: (genre: string) => void;
}

const GenreFilter: React.FC<GenreFilterProps> = ({ selectedGenres, onGenreSelect }) => {
  return (
    <div className="mb-8">
      <h3 className="font-medium mb-3 text-lg">Filter by Genre</h3>
      <div className="flex flex-wrap gap-2">
        {genres.map((genre) => {
          const isSelected = selectedGenres.includes(genre.id);
          return (
            <Badge
              key={genre.id}
              variant={isSelected ? "default" : "outline"}
              className={`
                cursor-pointer px-3 py-1.5 
                ${isSelected 
                  ? 'bg-anime-purple hover:bg-anime-purple/80' 
                  : 'hover:bg-muted'}
              `}
              onClick={() => onGenreSelect(genre.id)}
            >
              {genre.name}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};

export default GenreFilter;
