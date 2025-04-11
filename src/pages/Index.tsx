
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import AnimeGrid from '@/components/AnimeGrid';
import { searchAnime, animeData } from '@/services/animeData';

const Index = () => {
  const [searchResults, setSearchResults] = useState(animeData);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (query: string) => {
    if (query.length > 0) {
      setSearchResults(searchAnime(query));
      setHasSearched(true);
    } else {
      setSearchResults(animeData);
      setHasSearched(false);
    }
  };

  // Filter for top rated anime
  const topRatedAnime = [...animeData]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  // Filter for latest anime (based on year)
  const latestAnime = [...animeData]
    .sort((a, b) => b.year - a.year)
    .slice(0, 5);

  return (
    <div className="flex flex-col min-h-screen">
      <Header onSearch={handleSearch} />
      
      <main className="flex-grow px-6 py-8 max-w-7xl mx-auto w-full">
        {hasSearched ? (
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
            
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6">Top Rated Anime</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                {topRatedAnime.map((anime) => (
                  <AnimeCard key={anime.id} anime={anime} />
                ))}
              </div>
            </section>
            
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6">Latest Releases</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                {latestAnime.map((anime) => (
                  <AnimeCard key={anime.id} anime={anime} />
                ))}
              </div>
            </section>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

// Import here to avoid circular dependencies
import AnimeCard from '@/components/AnimeCard';

export default Index;
