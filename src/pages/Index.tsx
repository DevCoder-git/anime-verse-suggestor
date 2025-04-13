
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import AnimeGrid from '@/components/AnimeGrid';
import TrendingSection from '@/components/TrendingSection';
import { Anime } from '@/services/animeData';
import { fetchAnimeList, searchAnimeByQuery } from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from "sonner";

const Index = () => {
  const [searchResults, setSearchResults] = useState<Anime[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Fetch anime list with fallback to mock data
  const { data: animeList = [], isLoading, error, refetch } = useQuery({
    queryKey: ['animeList', retryCount],
    queryFn: async () => {
      console.log('Fetching anime list...');
      try {
        const result = await fetchAnimeList();
        console.log('Anime list fetch successful:', result.length, 'items');
        return result;
      } catch (error) {
        console.error("Failed to fetch anime list:", error);
        toast.error("Failed to load anime data");
        throw error;
      }
    },
    retry: 1, // Only retry once since we have mock fallback
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Add effect to notify about using mock data
  useEffect(() => {
    if (animeList.length > 0 && !isLoading) {
      // Show a toast only if we're using mock data (first time)
      if (error) {
        toast.info("Using mock data for demonstration");
      }
    }
  }, [animeList, isLoading, error]);

  const handleSearch = async (query: string) => {
    if (query.length > 0) {
      try {
        const results = await searchAnimeByQuery(query);
        setSearchResults(results);
        setHasSearched(true);
      } catch (error) {
        console.error("Search failed:", error);
        toast.error("Search failed. Please try again.");
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
      setHasSearched(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    refetch();
    toast.info("Retrying to load anime data...");
  };

  // Ensure top rated and latest anime are only computed when animeList is available
  const topRatedAnime = animeList && animeList.length > 0 
    ? [...animeList].sort((a, b) => b.rating - a.rating).slice(0, 5)
    : [];

  const latestAnime = animeList && animeList.length > 0
    ? [...animeList].sort((a, b) => b.year - a.year).slice(0, 5)
    : [];

  return (
    <div className="flex flex-col min-h-screen">
      <Header onSearch={handleSearch} />
      
      <main className="flex-grow px-6 py-8 max-w-7xl mx-auto w-full">
        {isLoading ? (
          <div className="space-y-8">
            <Hero />
            <TrendingSection />
            
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6">Top Rated Anime</h2>
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
          </div>
        ) : error ? (
          <div className="text-center my-20">
            <div className="text-amber-500 text-2xl mb-4">
              Using mock data for demonstration
            </div>
            <p className="text-muted-foreground mb-4">
              The backend server couldn't be reached, but we're showing sample data instead.
            </p>
            <button 
              className="mt-4 px-4 py-2 bg-anime-purple text-white rounded-md hover:bg-anime-purple/90"
              onClick={handleRetry}
            >
              Try Again with Real Data
            </button>
          </div>
        ) : hasSearched ? (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Search Results</h2>
            <AnimeGrid 
              animeList={searchResults}
              emptyMessage="No results found. Try a different search term."
            />
          </div>
        ) : (
          <>
            <Hero />
            
            <TrendingSection />
            
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6">Top Rated Anime</h2>
              <AnimeGrid 
                animeList={topRatedAnime} 
                emptyMessage="No top-rated anime available."
              />
            </section>
            
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6">Latest Releases</h2>
              <AnimeGrid 
                animeList={latestAnime}
                emptyMessage="No latest anime available." 
              />
            </section>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
