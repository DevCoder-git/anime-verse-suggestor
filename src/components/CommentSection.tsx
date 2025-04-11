
import React, { useState } from 'react';
import { Comment } from '@/services/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { fetchAnimeComments, postComment } from '@/services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface CommentSectionProps {
  animeId: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({ animeId }) => {
  const [commentText, setCommentText] = useState('');
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['comments', animeId],
    queryFn: () => fetchAnimeComments(animeId)
  });

  const mutation = useMutation({
    mutationFn: (content: string) => postComment(animeId, content),
    onSuccess: () => {
      setCommentText('');
      queryClient.invalidateQueries({ queryKey: ['comments', animeId] });
      toast({
        title: "Comment Posted",
        description: "Your comment has been added successfully"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to post your comment. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    mutation.mutate(commentText);
  };

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold mb-6">Comments</h3>
      
      {/* Comment form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <Textarea
            placeholder="Share your thoughts on this anime..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="min-h-[100px] mb-2"
          />
          <Button 
            type="submit" 
            className="bg-anime-purple hover:bg-anime-purple/90"
            disabled={!commentText.trim() || mutation.isPending}
          >
            {mutation.isPending ? 'Posting...' : 'Post Comment'}
          </Button>
        </form>
      ) : (
        <div className="bg-muted/30 p-4 rounded-md mb-8 text-center">
          <p className="mb-2">Please login to leave a comment</p>
          <Button 
            onClick={() => window.location.href = '/auth'}
            variant="outline"
          >
            Login / Register
          </Button>
        </div>
      )}
      
      {/* Comments list */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-anime-purple"></div>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12 bg-muted/20 rounded-md">
            <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={comment.user.avatar} alt={comment.user.username} />
                <AvatarFallback className="bg-muted">
                  {comment.user.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{comment.user.username}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-foreground/90">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
