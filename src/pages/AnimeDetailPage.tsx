
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RecommendationWidget from '@/components/RecommendationWidget';
import { getAnimeById } from '@/services/animeData';
import { Badge } from '@/components/ui/badge';
import { Star, Calendar, Film, Users, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const AnimeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const animeId = parseInt(id || '0');
  const anime = getAnimeById(animeId);
  
  useEffect(() => {
    if (!anime) {
      navigate('/not-found');
    }
  }, [anime, navigate]);
  
  const handleAddToFavorites = () => {
    toast({
      title: "Added to favorites",
      description: `${anime?.title} has been added to your favorites.`,
    });
  };
  
  if (!anime) {
    return null;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <div 
          className="w-full h-64 md:h-80 bg-cover bg-center relative"
          style={{ 
            backgroundImage: `url(${anime.image})`,
            backgroundPosition: 'center 25%',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-background"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-10">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-48 md:w-64 flex-shrink-0 mx-auto md:mx-0">
              <img 
                src={anime.image} 
                alt={anime.title} 
                className="w-full h-auto rounded-md shadow-lg border-4 border-background"
              />
            </div>
            
            <div className="flex-grow">
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <h1 className="text-3xl md:text-4xl font-bold">{anime.title}</h1>
                  <div className="flex items-center gap-1 text-lg font-semibold bg-muted/60 px-3 py-1 rounded-md">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <span>{anime.rating}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {anime.genres.map((genre, index) => (
                    <Badge key={index} className="bg-anime-purple/80 hover:bg-anime-purple text-white">
                      {genre}
                    </Badge>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="flex flex-col items-center p-3 bg-muted/40 rounded-md">
                    <Film className="h-5 w-5 text-anime-purple mb-1" />
                    <span className="text-sm text-muted-foreground">Type</span>
                    <span className="font-medium">{anime.type}</span>
                  </div>
                  
                  <div className="flex flex-col items-center p-3 bg-muted/40 rounded-md">
                    <Calendar className="h-5 w-5 text-anime-purple mb-1" />
                    <span className="text-sm text-muted-foreground">Year</span>
                    <span className="font-medium">{anime.year}</span>
                  </div>
                  
                  <div className="flex flex-col items-center p-3 bg-muted/40 rounded-md">
                    <span className="font-bold text-anime-purple mb-1">#</span>
                    <span className="text-sm text-muted-foreground">Episodes</span>
                    <span className="font-medium">{anime.episodes}</span>
                  </div>
                  
                  <div className="flex flex-col items-center p-3 bg-muted/40 rounded-md">
                    <Users className="h-5 w-5 text-anime-purple mb-1" />
                    <span className="text-sm text-muted-foreground">Studios</span>
                    <span className="font-medium truncate max-w-full">
                      {anime.studios.join(", ")}
                    </span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-semibold mb-2 text-lg">Synopsis</h3>
                  <p className="text-muted-foreground">{anime.synopsis}</p>
                </div>
                
                <Button 
                  onClick={handleAddToFavorites}
                  className="bg-anime-pink hover:bg-anime-pink/90 text-foreground"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Add to Favorites
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-12 mb-8">
            <h2 className="text-2xl font-semibold mb-6">You May Also Like</h2>
            <RecommendationWidget animeId={anime.id} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AnimeDetailPage;
