import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import TierBadge from '../components/TierBadge';
import { GAMEMODES } from '../utils/tiers';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPlayers();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = players.filter(player =>
        player.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPlayers(filtered);
    } else {
      setFilteredPlayers(players);
    }
  }, [searchQuery, players]);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/players');
      const data = await response.json();
      setPlayers(data.players);
      setFilteredPlayers(data.players);
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Search Players</h1>
      
      <div className="relative mb-8 max-w-2xl mx-auto">
        <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field w-full pl-12"
        />
      </div>

      {loading ? (
        <div className="text-center text-gray-400">Loading players...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlayers.map((player) => (
            <Link
              key={player.id}
              to={`/player/${player.username}`}
              className="glass-card p-6 hover:border-primary/50 transition-all duration-300 transform hover:scale-105 animate-fade-in"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={player.skin_url}
                  alt={player.username}
                  className="w-16 h-32 object-cover rounded-lg"
                />
                <div>
                  <h3 className="text-xl font-bold">{player.username}</h3>
                  <TierBadge tier={player.overall_tier} />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-sm">
                {GAMEMODES.slice(0, 6).map(mode => (
                  <div key={mode.key} className="text-gray-400">
                    <span>{mode.emoji}</span>
                    <span className="ml-1">{player[mode.key] || '-'}</span>
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && filteredPlayers.length === 0 && (
        <div className="text-center text-gray-400 py-12">
          No players found. Try a different search term.
        </div>
      )}
    </div>
  );
};

export default Search;
