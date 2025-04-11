
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RecommendationWidget from '@/components/RecommendationWidget';

const DiscoverPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow px-6 py-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Discover Anime</h1>
          <p className="text-muted-foreground text-lg">
            Find your next favorite anime based on your preferences. Select genres and types that interest you.
          </p>
        </div>
        
        <RecommendationWidget />
      </main>
      
      <Footer />
    </div>
  );
};

export default DiscoverPage;
