import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import TierBadge from '../components/TierBadge';
import { GAMEMODES, calculateOverallPoints, getOverallTierFromPoints } from '../utils/tiers';
import { ArrowLeft } from 'lucide-react';

const PlayerProfile = () => {
  const { username } = useParams();
  const [player, setPlayer] = useState(null);
  const [overallRank, setOverallRank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlayer();
    fetchOverallRank();
  }, [username]);

  const fetchPlayer = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/players/${username}`);
      const data = await response.json();
      setPlayer(data.player);
    } catch (error) {
      console.error('Error fetching player:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOverallRank = async () => {
    try {
      const response = await fetch('/api/players');
      const data = await response.json();
      
      // Calculate average points and determine overall tier for each player
      const playersWithAverage = data.players.map(p => {
        const averagePoints = calculateOverallPoints(p);
        const calculatedTier = getOverallTierFromPoints(averagePoints);
        return {
          ...p,
          averagePoints,
          calculatedTier
        };
      });
      
      // Filter out unranked players
      const rankedPlayers = playersWithAverage.filter(p => 
        p.calculatedTier !== 'Unranked'
      );
      
      // Sort by average points descending
      rankedPlayers.sort((a, b) => b.averagePoints - a.averagePoints);
      
      const rank = rankedPlayers.findIndex(p => p.username === username);
      if (rank !== -1) {
        setOverallRank(rank + 1);
      }
    } catch (error) {
      console.error('Error fetching overall rank:', error);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-400 py-12">Loading player profile...</div>;
  }

  if (!player) {
    return <div className="text-center text-gray-400 py-12">Player not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/search" className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft size={20} />
        Back to Search
      </Link>

      <div className="glass-card p-8 mb-8 animate-fade-in">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <img
            src={player.skin_url}
            alt={player.username}
            className="w-48 h-96 object-cover rounded-xl"
          />
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold mb-4">{player.username}</h1>
            <div className="mb-6">
              <span className="text-gray-400 mr-2">Overall Tier:</span>
              <TierBadge tier={player.overall_tier} />
            </div>
            
            {overallRank && (
              <div className="mb-4">
                <span className="text-gray-400 mr-2">Overall Rank:</span>
                <span className="text-white font-bold text-2xl">#{overallRank}</span>
              </div>
            )}
            
            {player.region && (
              <div className="mb-4">
                <span className="text-gray-400 mr-2">Region:</span>
                <span className="text-white font-semibold">{player.region}</span>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
              <div>
                <span className="block text-gray-500">Added</span>
                {new Date(player.created_at).toLocaleDateString()}
              </div>
              <div>
                <span className="block text-gray-500">Last Updated</span>
                {new Date(player.updated_at).toLocaleDateString()}
              </div>
              {player.updated_by && (
                <div>
                  <span className="block text-gray-500">Updated By</span>
                  {player.updated_by}
                </div>
              )}
            </div>
            
            {player.notes && (
              <div className="mt-6 p-4 bg-darker rounded-lg">
                <h3 className="text-gray-500 mb-2">Notes</h3>
                <p className="text-gray-300">{player.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="glass-card p-8 animate-slide-up">
        <h2 className="text-2xl font-bold mb-6">Gamemode Rankings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {GAMEMODES.map((mode) => (
            <div key={mode.key} className="bg-darker/50 p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{mode.emoji}</span>
                <span className="font-semibold">{mode.name}</span>
              </div>
              <TierBadge tier={player[mode.key]} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;
