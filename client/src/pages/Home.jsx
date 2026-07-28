import { Link } from 'react-router-dom';
import { Search, Trophy, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-4xl animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-pink-500 bg-clip-text text-transparent">
          Minecraft PvP Tier Rankings
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto">
          Search players, browse leaderboards, and compare rankings across every supported PvP gamemode.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/search" className="btn-primary flex items-center justify-center gap-2 text-lg">
            <Search size={24} />
            Search Players
          </Link>
          <Link to="/leaderboard" className="btn-secondary flex items-center justify-center gap-2 text-lg">
            <Trophy size={24} />
            Leaderboards
          </Link>
        </div>
        
        <div className="mt-16 grid grid-cols-3 md:grid-cols-9 gap-4 max-w-3xl mx-auto">
          {['⚔️', '🪓', '🔱', '☄️', '🪽', '❤️', '💎', '🧪', '💥'].map((emoji, index) => (
            <div key={index} className="text-4xl animate-pulse-slow" style={{ animationDelay: `${index * 0.1}s` }}>
              {emoji}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
