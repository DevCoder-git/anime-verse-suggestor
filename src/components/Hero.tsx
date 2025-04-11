
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-anime-gradient text-white py-16 px-6 rounded-xl mb-16">
      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-float">
          Discover Your Next <span className="text-anime-pink">Anime</span> Adventure
        </h1>
        <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl">
          Find the perfect anime that matches your taste with our personalized recommendation system.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button 
            size="lg" 
            onClick={() => navigate('/discover')}
            className="bg-white text-anime-purple hover:bg-white/90 font-medium"
          >
            Get Recommendations
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-white text-white hover:bg-white/20 font-medium"
          >
            Browse Popular
          </Button>
        </div>
      </div>
      
      <div className="absolute top-0 right-0 w-full h-full opacity-10">
        <div className="absolute top-8 right-8 w-40 h-40 rounded-full bg-anime-blue animate-pulse-light blur-3xl"></div>
        <div className="absolute bottom-12 right-24 w-64 h-64 rounded-full bg-anime-pink animate-pulse-light blur-3xl"></div>
        <div className="absolute top-24 left-12 w-56 h-56 rounded-full bg-anime-purple animate-pulse-light blur-3xl"></div>
      </div>
    </div>
  );
};

export default Hero;
