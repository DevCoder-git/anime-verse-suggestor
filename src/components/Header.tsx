
import React from 'react';
import { Search, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  onSearch?: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const { isAuthenticated, user } = useAuth();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <header className="w-full bg-background border-b border-border py-4 px-6 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-anime-purple rounded-full w-8 h-8 flex items-center justify-center animate-pulse-light">
            <span className="text-white font-bold">AV</span>
          </div>
          <h1 className="text-2xl font-bold text-anime-purple">
            Anime<span className="text-anime-blue">Verse</span>
          </h1>
        </Link>
        
        <div className="flex flex-1 max-w-md relative">
          <div className="relative w-full">
            <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Search for anime..."
              className="pl-9 bg-muted/50 border-muted hover:border-primary focus:border-primary transition-all"
              onChange={handleSearchChange}
            />
          </div>
        </div>
        
        <nav className="flex items-center gap-6">
          <Link to="/" className="text-foreground hover:text-primary transition-colors font-medium">Home</Link>
          <Link to="/discover" className="text-foreground hover:text-primary transition-colors font-medium">Discover</Link>
          <Link to="/favorites" className="text-foreground hover:text-primary transition-colors font-medium">Favorites</Link>
          
          {isAuthenticated ? (
            <Link to="/profile" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <div className="w-8 h-8 rounded-full bg-anime-purple/20 flex items-center justify-center">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.username}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <User className="h-4 w-4 text-anime-purple" />
                )}
              </div>
              <span className="font-medium hidden md:inline">{user?.username || 'Profile'}</span>
            </Link>
          ) : (
            <Link to="/auth">
              <Button variant="outline" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Login</span>
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
