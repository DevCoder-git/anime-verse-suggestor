
import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  initialRating?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

const RatingStars: React.FC<RatingStarsProps> = ({
  initialRating = 0,
  max = 5,
  size = 'md',
  readOnly = false,
  onRatingChange,
  className,
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  
  const handleClick = (index: number) => {
    if (readOnly) return;
    const newRating = index + 1;
    setRating(newRating);
    if (onRatingChange) {
      onRatingChange(newRating);
    }
  };
  
  const starSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-7 w-7',
  };
  
  const getContainerClass = () => {
    return cn(
      'flex gap-1',
      className,
    );
  };
  
  return (
    <div className={getContainerClass()}>
      {[...Array(max)].map((_, index) => {
        const active = (hoverRating || rating) > index;
        
        return (
          <Star
            key={index}
            className={cn(
              starSizes[size],
              'cursor-pointer transition-all',
              active ? 'text-yellow-400 fill-yellow-400' : 'text-muted stroke-muted',
              readOnly && 'cursor-default'
            )}
            onClick={() => handleClick(index)}
            onMouseEnter={() => !readOnly && setHoverRating(index + 1)}
            onMouseLeave={() => !readOnly && setHoverRating(0)}
          />
        );
      })}
    </div>
  );
};

export default RatingStars;
