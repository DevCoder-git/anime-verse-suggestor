
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { fetchWatchlist } from '@/services/api';
import AnimeGrid from '@/components/AnimeGrid';
import { Link } from 'react-router-dom';

const FavoritesPage = () => {
  const { isAuthenticated } = useAuth();

  const { data: watchlist = [], isLoading } = useQuery({
    queryKey: ['watchlist'],
    queryFn: fetchWatchlist,
    enabled: isAuthenticated
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow px-6 py-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Your Favorites</h1>
          <p className="text-muted-foreground text-lg">
            Manage your collection of favorite anime.
          </p>
        </div>
        
        {!isAuthenticated ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-muted/30 rounded-lg">
            <Heart className="h-16 w-16 text-anime-pink mb-4" />
            <h2 className="text-2xl font-medium text-foreground mb-2">Login to see your favorites</h2>
            <p className="text-muted-foreground mb-6">
              Login to your account to access your watchlist
            </p>
            <Link to="/auth">
              <Button className="bg-anime-purple hover:bg-anime-purple/90 text-white">
                Login / Register
              </Button>
            </Link>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-anime-purple"></div>
          </div>
        ) : (
          <AnimeGrid 
            animeList={watchlist} 
            emptyMessage="Your watchlist is empty. Start adding anime from the discover page!" 
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default FavoritesPage;
