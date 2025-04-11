
import React from 'react';
import AnimeCard from './AnimeCard';
import { Anime } from '@/services/animeData';

interface AnimeGridProps {
  animeList: Anime[];
  emptyMessage?: string;
}

const AnimeGrid: React.FC<AnimeGridProps> = ({ animeList, emptyMessage = "No anime found" }) => {
  if (animeList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-5xl mb-4">😢</div>
        <h3 className="text-xl font-medium text-foreground mb-2">{emptyMessage}</h3>
        <p className="text-muted-foreground">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
      {animeList.map((anime) => (
        <AnimeCard key={anime.id} anime={anime} />
      ))}
    </div>
  );
};

export default AnimeGrid;
