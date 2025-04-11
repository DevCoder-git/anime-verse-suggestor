
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchAnimeById, getUserRating, rateAnime } from '@/services/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RecommendationWidget from '@/components/RecommendationWidget';
import RatingStars from '@/components/RatingStars';
import WatchlistButton from '@/components/WatchlistButton';
import CommentSection from '@/components/CommentSection';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

const AnimeDetailPage = () => {
  const { id } = useParams();
  const animeId = parseInt(id || '0');
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data: anime, isLoading } = useQuery({
    queryKey: ['anime', animeId],
    queryFn: () => fetchAnimeById(animeId),
    enabled: !!animeId,
  });

  const { data: userRating } = useQuery({
    queryKey: ['userRating', animeId],
    queryFn: () => getUserRating(animeId),
    enabled: !!animeId && isAuthenticated
  });

  const rateMutation = useMutation({
    mutationFn: (score: number) => rateAnime(animeId, score),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRating', animeId] });
      toast({
        title: "Rating Submitted",
        description: "Your rating has been saved",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit your rating",
        variant: "destructive"
      });
    }
  });

  const handleRatingChange = (rating: number) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to rate anime",
        variant: "destructive"
      });
      return;
    }
    rateMutation.mutate(rating);
  };

  if (isLoading || !anime) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow px-6 py-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-anime-purple"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow px-6 py-8 max-w-7xl mx-auto w-full">
        {/* Hero section */}
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 mb-10">
          {/* Left column - Image & quick info */}
          <div className="space-y-4">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img src={anime.image} alt={anime.title} className="w-full h-auto object-cover" />
            </div>
            
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Type</span>
                    <span className="font-medium">{anime.type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Episodes</span>
                    <span className="font-medium">{anime.episodes}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Year</span>
                    <span className="font-medium">{anime.year}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Season</span>
                    <span className="font-medium">{anime.season}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex flex-col space-y-2">
              <WatchlistButton animeId={anime.id} variant="default" />
            </div>
          </div>
          
          {/* Right column - Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{anime.title}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <RatingStars initialRating={anime.rating / 2} readOnly size="lg" />
                  <span className="ml-2 text-lg font-medium">{anime.rating.toFixed(1)}</span>
                </div>
                
                {isAuthenticated && (
                  <div className="flex items-center gap-2">
                    <Separator orientation="vertical" className="h-6" />
                    <span className="text-sm text-muted-foreground">Your Rating:</span>
                    <RatingStars 
                      initialRating={userRating || 0} 
                      onRatingChange={handleRatingChange}
                      size="md"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {anime.genres.map((genre, index) => (
                  <Badge key={index} variant="outline" className="bg-muted/50">
                    {genre}
                  </Badge>
                ))}
              </div>
              
              <p className="text-lg mb-4">{anime.synopsis}</p>
              
              <div>
                <h3 className="text-lg font-medium mb-1">Studios</h3>
                <div className="flex flex-wrap gap-2">
                  {anime.studios.map((studio, index) => (
                    <Badge key={index} className="bg-anime-purple">
                      {studio}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recommendations */}
        <RecommendationWidget animeId={anime.id} />
        
        {/* Comments Section */}
        <CommentSection animeId={anime.id} />
      </main>
      
      <Footer />
    </div>
  );
};

export default AnimeDetailPage;
