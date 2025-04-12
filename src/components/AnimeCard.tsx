
import React from 'react';
import { Link } from 'react-router-dom';
import { Anime } from '@/services/animeData';
import { Badge } from "@/components/ui/badge";
import { Star } from 'lucide-react';

interface AnimeCardProps {
  anime: Anime;
  className?: string;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime, className }) => {
  const maxGenres = 2; // Maximum number of genres to display
  
  return (
    <Link to={`/anime/${anime.id}`} className={`anime-card block rounded-lg overflow-hidden shadow-md bg-anime-card ${className}`}>
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={anime.image} 
          alt={anime.title}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
        <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1">
          <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
          <span className="text-white">{anime.rating}</span>
        </div>
        {anime.type && (
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-anime-purple/90 text-white hover:bg-anime-purple">
              {anime.type}
            </Badge>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold line-clamp-1 text-foreground mb-1">{anime.title}</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {anime.genres.slice(0, maxGenres).map((genre, index) => (
            <Badge key={index} variant="outline" className="bg-muted/50 text-xs">
              {genre}
            </Badge>
          ))}
          {anime.genres.length > maxGenres && (
            <Badge variant="outline" className="bg-muted/50 text-xs">
              +{anime.genres.length - maxGenres}
            </Badge>
          )}
        </div>
      </div>
    </Link>
  );
};

export default AnimeCard;
