
import React from 'react';
import { Button } from '@/components/ui/button';
import { BookmarkIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { isInWatchlist, addToWatchlist, removeFromWatchlist } from '@/services/api';
import { toast } from '@/hooks/use-toast';

interface WatchlistButtonProps {
  animeId: number;
  variant?: 'default' | 'outline' | 'ghost';
}

const WatchlistButton: React.FC<WatchlistButtonProps> = ({ animeId, variant = 'outline' }) => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  
  const { data: inWatchlist = false, isLoading } = useQuery({
    queryKey: ['watchlist', 'status', animeId],
    queryFn: () => isInWatchlist(animeId),
    enabled: isAuthenticated,
    staleTime: 30000, // Don't refetch too often
  });
  
  const addMutation = useMutation({
    mutationFn: () => addToWatchlist(animeId),
    onSuccess: () => {
      queryClient.setQueryData(['watchlist', 'status', animeId], true);
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      toast({
        title: "Added to Watchlist",
        description: "Anime has been added to your watchlist",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add to watchlist",
        variant: "destructive"
      });
    }
  });
  
  const removeMutation = useMutation({
    mutationFn: () => removeFromWatchlist(animeId),
    onSuccess: () => {
      queryClient.setQueryData(['watchlist', 'status', animeId], false);
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      toast({
        title: "Removed from Watchlist",
        description: "Anime has been removed from your watchlist",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove from watchlist",
        variant: "destructive"
      });
    }
  });
  
  const handleWatchlistClick = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to manage your watchlist",
        variant: "destructive"
      });
      return;
    }
    
    if (inWatchlist) {
      removeMutation.mutate();
    } else {
      addMutation.mutate();
    }
  };
  
  return (
    <Button
      variant={variant}
      onClick={handleWatchlistClick}
      disabled={isLoading || addMutation.isPending || removeMutation.isPending}
      className={inWatchlist ? "bg-anime-purple text-white hover:bg-anime-purple/90" : ""}
    >
      <BookmarkIcon className={`h-5 w-5 mr-1 ${inWatchlist ? 'fill-current' : ''}`} />
      {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
    </Button>
  );
};

export default WatchlistButton;
