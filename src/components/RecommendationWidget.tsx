
import React, { useState } from 'react';
import { Anime } from '@/services/animeData';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import AnimeGrid from './AnimeGrid';
import GenreFilter from './GenreFilter';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { getAnimeRecommendations } from '@/services/api';
import { useQuery } from '@tanstack/react-query';

interface RecommendationWidgetProps {
  animeId?: number;
}

const RecommendationWidget: React.FC<RecommendationWidgetProps> = ({ animeId }) => {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<Anime[]>([]);

  const { data: similarAnime = [], isLoading: isLoadingSimilar } = useQuery({
    queryKey: ['similarAnime', animeId],
    queryFn: () => getAnimeRecommendations([], '', animeId || 0),
    enabled: !!animeId
  });

  const { isLoading: isLoadingRecommendations, refetch: getRecommendations } = useQuery({
    queryKey: ['recommendations', selectedGenres, selectedType],
    queryFn: async () => {
      const results = await getAnimeRecommendations(selectedGenres, selectedType);
      setRecommendations(results);
      return results;
    },
    enabled: false, // Don't run automatically, wait for user to click the button
  });

  const handleGenreSelect = (genreId: string) => {
    setSelectedGenres(prev => 
      prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
  };

  const handleGetRecommendations = () => {
    setHasSearched(true);
    getRecommendations();
  };

  const isLoading = isLoadingSimilar || isLoadingRecommendations;

  return (
    <div className="mb-10">
      {!animeId && (
        <>
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex-1">
              <GenreFilter 
                selectedGenres={selectedGenres} 
                onGenreSelect={handleGenreSelect} 
              />
            </div>
            
            <div className="w-full md:w-64">
              <h3 className="font-medium mb-3 text-lg">Type</h3>
              <Select value={selectedType} onValueChange={handleTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Type</SelectItem>
                  <SelectItem value="TV">TV Series</SelectItem>
                  <SelectItem value="Movie">Movie</SelectItem>
                  <SelectItem value="OVA">OVA</SelectItem>
                  <SelectItem value="Special">Special</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-center mb-8">
            <Button 
              onClick={handleGetRecommendations}
              className="bg-anime-purple hover:bg-anime-purple/90 text-white"
              size="lg"
              disabled={isLoadingRecommendations}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {isLoadingRecommendations ? "Finding Anime..." : "Get AI Recommendations"}
            </Button>
          </div>
        </>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-anime-purple"></div>
        </div>
      ) : hasSearched || animeId ? (
        <div>
          <h2 className="text-2xl font-semibold mb-6">
            {animeId ? "Similar Anime" : "Recommended For You"}
          </h2>
          <AnimeGrid 
            animeList={animeId ? similarAnime : recommendations} 
            emptyMessage="No matching recommendations found"
          />
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <div className="text-5xl mb-4">✨</div>
          <h3 className="text-xl font-medium text-foreground mb-2">
            Discover Your Next Favorite Anime
          </h3>
          <p className="text-muted-foreground mb-6">
            Our AI recommendation system will find the perfect anime based on your preferences
          </p>
        </div>
      )}
    </div>
  );
};

export default RecommendationWidget;
