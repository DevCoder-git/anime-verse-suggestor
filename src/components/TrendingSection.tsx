
import React from 'react';
import { Anime } from '@/services/types';
import { fetchTrendingAnime } from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import AnimeCard from './AnimeCard';
import { TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const TrendingSection: React.FC = () => {
  const { data: trendingAnime = [], isLoading, error } = useQuery({
    queryKey: ['trending'],
    queryFn: fetchTrendingAnime,
    retry: 1, // Only retry once since we have mock fallback
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
            <div key={i} className="w-full">
              <Skeleton className="w-full aspect-[3/4] rounded-lg mb-2" />
              <Skeleton className="h-4 w-3/4 mb-1" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error || trendingAnime.length === 0) {
    // This shouldn't happen with our fallback, but just in case
    return (
      <section className="mb-16">
        <div className="flex items-center mb-6">
          <TrendingUp className="mr-2 h-6 w-6 text-anime-purple" />
          <h2 className="text-3xl font-bold">Trending Now</h2>
        </div>
        <p className="text-muted-foreground">Trending anime will appear here.</p>
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
