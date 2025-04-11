
import React, { useState } from 'react';
import { getRecommendations, Anime } from '@/services/animeData';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import AnimeGrid from './AnimeGrid';
import GenreFilter from './GenreFilter';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface RecommendationWidgetProps {
  animeId?: number;
}

const RecommendationWidget: React.FC<RecommendationWidgetProps> = ({ animeId }) => {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [recommendations, setRecommendations] = useState<Anime[]>([]);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

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
    const results = getRecommendations(selectedGenres, selectedType, animeId);
    setRecommendations(results);
    setHasSearched(true);
  };

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
                  <SelectItem value="">Any Type</SelectItem>
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
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Get Recommendations
            </Button>
          </div>
        </>
      )}
      
      {hasSearched || animeId ? (
        <div>
          <h2 className="text-2xl font-semibold mb-6">
            {animeId ? "Similar Anime" : "Recommended For You"}
          </h2>
          <AnimeGrid 
            animeList={animeId ? getRecommendations([], '', animeId) : recommendations} 
            emptyMessage="No matching recommendations found"
          />
        </div>
      ) : (
        animeId ? (
          <AnimeGrid 
            animeList={getRecommendations([], '', animeId)} 
            emptyMessage="No similar anime found"
          />
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <div className="text-5xl mb-4">✨</div>
            <h3 className="text-xl font-medium text-foreground mb-2">
              Discover Your Next Favorite Anime
            </h3>
            <p className="text-muted-foreground mb-6">
              Select your preferences and click "Get Recommendations"
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default RecommendationWidget;
