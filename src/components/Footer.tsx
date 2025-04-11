
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/30 border-t border-border py-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="bg-anime-purple rounded-full w-8 h-8 flex items-center justify-center">
              <span className="text-white font-bold">AV</span>
            </div>
            <h2 className="text-xl font-bold text-anime-purple">
              Anime<span className="text-anime-blue">Verse</span>
            </h2>
          </Link>
          <p className="text-muted-foreground">
            Discover your next favorite anime with our personalized recommendation system.
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold mb-4">Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
            <li><Link to="/discover" className="text-muted-foreground hover:text-primary transition-colors">Discover</Link></li>
            <li><Link to="/favorites" className="text-muted-foreground hover:text-primary transition-colors">Favorites</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold mb-4">Contact</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li>Email: info@animeverse.com</li>
            <li>Twitter: @animeverse</li>
            <li>Discord: discord.gg/animeverse</li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-muted-foreground text-sm">© {currentYear} AnimeVerse. All rights reserved.</p>
        <div className="flex gap-6">
          <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms</Link>
          <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy</Link>
          <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
