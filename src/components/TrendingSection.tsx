
import React from 'react';
import { Anime } from '@/services/types';
import { fetchTrendingAnime } from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import AnimeCard from './AnimeCard';
import { TrendingUp } from 'lucide-react';

const TrendingSection: React.FC = () => {
  const { data: trendingAnime = [], isLoading } = useQuery({
    queryKey: ['trending'],
    queryFn: fetchTrendingAnime,
  });

  if (isLoading) {
    return (
      <section className="mb-16">
        <div className="flex items-center mb-6">
          <TrendingUp className="mr-2 h-6 w-6 text-anime-purple" />
          <h2 className="text-3xl font-bold">Trending Now</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-16">
      <div className="flex items-center mb-6">
        <TrendingUp className="mr-2 h-6 w-6 text-anime-purple" />
        <h2 className="text-3xl font-bold">Trending Now</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {trendingAnime.map((anime) => (
          <AnimeCard key={anime.id} anime={anime} />
        ))}
      </div>
    </section>
  );
};

export default TrendingSection;
