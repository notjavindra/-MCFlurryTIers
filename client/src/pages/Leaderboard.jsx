import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TierBadge from '../components/TierBadge';
import { GAMEMODES, TIER_ORDER } from '../utils/tiers';
import { Search as SearchIcon } from 'lucide-react';
import API_URL from '../api';

const Leaderboard = () => {
  const [selectedGamemode, setSelectedGamemode] = useState('overall');
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);

  const gamemodes = [
    { key: 'overall', name: 'Overall', emoji: '🏆' },
    ...GAMEMODES
  ];

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedGamemode]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      if (selectedGamemode === 'overall') {
        // For overall, fetch all players and sort by overall_tier
        const response = await fetch(`${API_URL}/api/players`);
        const data = await response.json();
        
        // Filter out unranked players
        const rankedPlayers = data.players.filter(player => 
          player.overall_tier && player.overall_tier !== 'Unranked'
        );
        
        // Sort by overall_tier using TIER_ORDER
        rankedPlayers.sort((a, b) => {
          const aIndex = TIER_ORDER.indexOf(a.overall_tier);
          const bIndex = TIER_ORDER.indexOf(b.overall_tier);
          return aIndex - bIndex;
        });
        
        // Add tier property for display
        const playersWithTier = rankedPlayers.map(player => ({
          ...player,
          tier: player.overall_tier
        }));
        
        setPlayers(playersWithTier);
      } else {
        const response = await fetch(`${API_URL}/api/players/leaderboard/${selectedGamemode}`);
        const data = await response.json();
        setPlayers(data.players);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMedal = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Leaderboards</h1>
      
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {gamemodes.map((mode) => (
          <button
            key={mode.key}
            onClick={() => setSelectedGamemode(mode.key)}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              selectedGamemode === mode.key
                ? 'bg-gradient-to-r from-primary to-secondary text-white'
                : 'bg-white/10 text-gray-400 hover:bg-white/20'
            }`}
          >
            {mode.emoji} {mode.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-gray-400">Loading leaderboard...</div>
      ) : (
        <div className="space-y-4">
          {players.map((player, index) => (
            <Link
              key={player.id}
              to={`/player/${player.username}`}
              className="glass-card p-4 flex items-center gap-4 hover:border-primary/50 transition-all duration-300 transform hover:scale-[1.02] animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="text-2xl font-bold w-16 text-center">
                {getMedal(index)}
              </div>
              
              <img
                src={player.skin_url}
                alt={player.username}
                className="w-12 h-24 object-cover rounded-lg"
              />
              
              <div className="flex-1">
                <h3 className="text-xl font-bold">{player.username}</h3>
                <TierBadge tier={player.tier} />
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && players.length === 0 && (
        <div className="text-center text-gray-400 py-12">
          No players ranked in this gamemode yet.
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
