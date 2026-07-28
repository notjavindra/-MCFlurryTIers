import { Link } from 'react-router-dom';
import { Search, Trophy, Shield, MessageCircle } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="glass-card sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          MC Flurry Tiers
        </Link>
        
        <div className="flex items-center gap-6">
          <Link to="/search" className="flex items-center gap-2 text-gray-300 hover:text-white hover:scale-110 transition-all duration-300">
            <Search size={20} />
            <span className="hidden sm:inline">Search</span>
          </Link>
          <Link to="/leaderboard" className="flex items-center gap-2 text-gray-300 hover:text-white hover:scale-110 transition-all duration-300">
            <Trophy size={20} />
            <span className="hidden sm:inline">Leaderboard</span>
          </Link>
          <a 
            href="https://discord.gg/HasjemsCzd" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-300 hover:text-indigo-400 hover:scale-110 transition-all duration-300"
          >
            <MessageCircle size={20} />
            <span className="hidden sm:inline">Discord</span>
          </a>
          <Link to="/admin" className="flex items-center gap-2 text-gray-300 hover:text-white hover:scale-110 transition-all duration-300">
            <Shield size={20} />
            <span className="hidden sm:inline">Admin</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
