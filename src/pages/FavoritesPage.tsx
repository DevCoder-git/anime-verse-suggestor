
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

const FavoritesPage = () => {
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
        
        <div className="flex flex-col items-center justify-center py-16 text-center bg-muted/30 rounded-lg">
          <Heart className="h-16 w-16 text-anime-pink mb-4" />
          <h2 className="text-2xl font-medium text-foreground mb-2">No favorites yet</h2>
          <p className="text-muted-foreground mb-6">
            Start adding anime to your favorites collection
          </p>
          <Button 
            onClick={() => window.location.href = '/discover'}
            className="bg-anime-purple hover:bg-anime-purple/90 text-white"
          >
            Discover Anime
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FavoritesPage;
