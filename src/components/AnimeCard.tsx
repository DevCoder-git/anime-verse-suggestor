
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Anime } from '@/services/animeData';
import { Badge } from "@/components/ui/badge";
import { Star, ImageOff } from 'lucide-react';

interface AnimeCardProps {
  anime: Anime;
  className?: string;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime, className }) => {
  const maxGenres = 2; // Maximum number of genres to display
  const [imgError, setImgError] = useState(false);
  
  // Set a reliable placeholder image
  const placeholderImage = "/placeholder.svg";
  
  // Prepare image fallback mechanism
  const handleImageError = () => {
    console.log(`Image failed to load for: ${anime.title}`);
    setImgError(true);
  };
  
  return (
    <Link to={`/anime/${anime.id}`} className={`anime-card block rounded-lg overflow-hidden shadow-md bg-anime-card hover:shadow-lg transition-shadow duration-300 ${className}`}>
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-200">
        {imgError ? (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <ImageOff className="w-12 h-12 text-muted-foreground opacity-50" />
          </div>
        ) : (
          <img 
            src={anime.image || placeholderImage} 
            alt={anime.title || "Anime image"}
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
            onError={handleImageError}
            loading="lazy"
          />
        )}
        
        <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1">
          <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
          <span className="text-white">{anime.rating || "N/A"}</span>
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
        <h3 className="font-semibold line-clamp-1 text-foreground mb-1">{anime.title || "Unknown Anime"}</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {anime.genres && anime.genres.slice(0, maxGenres).map((genre, index) => (
            <Badge key={index} variant="outline" className="bg-muted/50 text-xs">
              {genre}
            </Badge>
          ))}
          {anime.genres && anime.genres.length > maxGenres && (
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
