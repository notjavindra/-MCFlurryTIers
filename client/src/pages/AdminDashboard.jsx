import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, Award, TrendingUp, LogOut, Plus, Edit, Trash2, Search as SearchIcon } from 'lucide-react';
import TierBadge from '../components/TierBadge';
import { GAMEMODES, ALL_TIERS } from '../utils/tiers';
import Toast from '../components/Toast';

const AdminDashboard = () => {
  const { isAuthenticated, logout, token } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [players, setPlayers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingPlayer, setDeletingPlayer] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    username: '',
    overall_tier: 'Unranked',
    region: '',
    sword: 'Unranked',
    axe: 'Unranked',
    spear: 'Unranked',
    mace: 'Unranked',
    spear_elytra: 'Unranked',
    uhc: 'Unranked',
    diamond_smp: 'Unranked',
    nether_pot: 'Unranked',
    crystals: 'Unranked',
    netherite_smp: 'Unranked',
    notes: '',
    updated_by: 'Admin',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }
    fetchData();
  }, [isAuthenticated]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, playersRes] = await Promise.all([
        fetch('/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/admin/players', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const statsData = await statsRes.json();
      const playersData = await playersRes.json();

      setStats(statsData);
      setPlayers(playersData.players);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlayer = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setToast({ message: 'Player added successfully!', type: 'success' });
        setShowAddModal(false);
        resetForm();
        fetchData();
      } else {
        const data = await response.json();
        setToast({ message: data.error || 'Failed to add player', type: 'error' });
      }
    } catch (error) {
      setToast({ message: 'An error occurred', type: 'error' });
    }
  };

  const handleEditPlayer = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/admin/players/${editingPlayer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setToast({ message: 'Player updated successfully!', type: 'success' });
        setShowEditModal(false);
        setEditingPlayer(null);
        resetForm();
        fetchData();
      } else {
        const data = await response.json();
        setToast({ message: data.error || 'Failed to update player', type: 'error' });
      }
    } catch (error) {
      setToast({ message: 'An error occurred', type: 'error' });
    }
  };

  const handleDeletePlayer = async () => {
    try {
      const response = await fetch(`/api/admin/players/${deletingPlayer.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setToast({ message: 'Player deleted successfully!', type: 'success' });
        setShowDeleteConfirm(false);
        setDeletingPlayer(null);
        fetchData();
      } else {
        setToast({ message: 'Failed to delete player', type: 'error' });
      }
    } catch (error) {
      setToast({ message: 'An error occurred', type: 'error' });
    }
  };

  const openEditModal = (player) => {
    setEditingPlayer(player);
    setFormData({
      username: player.username,
      overall_tier: player.overall_tier || 'Unranked',
      region: player.region || '',
      sword: player.sword || 'Unranked',
      axe: player.axe || 'Unranked',
      spear: player.spear || 'Unranked',
      mace: player.mace || 'Unranked',
      spear_elytra: player.spear_elytra || 'Unranked',
      uhc: player.uhc || 'Unranked',
      diamond_smp: player.diamond_smp || 'Unranked',
      nether_pot: player.nether_pot || 'Unranked',
      crystals: player.crystals || 'Unranked',
      netherite_smp: player.netherite_smp || 'Unranked',
      notes: player.notes || '',
      updated_by: 'Admin',
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      username: '',
      overall_tier: 'Unranked',
      region: '',
      sword: 'Unranked',
      axe: 'Unranked',
      spear: 'Unranked',
      mace: 'Unranked',
      spear_elytra: 'Unranked',
      uhc: 'Unranked',
      diamond_smp: 'Unranked',
      nether_pot: 'Unranked',
      crystals: 'Unranked',
      netherite_smp: 'Unranked',
      notes: '',
      updated_by: 'Admin',
    });
  };

  const filteredPlayers = players.filter(player =>
    player.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="text-center text-gray-400 py-12">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <button onClick={logout} className="btn-secondary flex items-center gap-2">
          <LogOut size={20} />
          Logout
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="glass-card p-6">
          <div className="flex items-center gap-4">
            <Users className="text-primary" size={32} />
            <div>
              <div className="text-3xl font-bold">{stats?.totalPlayers || 0}</div>
              <div className="text-gray-400">Total Players</div>
            </div>
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center gap-4">
            <Award className="text-green-500" size={32} />
            <div>
              <div className="text-3xl font-bold">{stats?.lt1Players || 0}</div>
              <div className="text-gray-400">LT1 Players</div>
            </div>
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center gap-4">
            <TrendingUp className="text-secondary" size={32} />
            <div>
              <div className="text-3xl font-bold">{stats?.rankedPlayers || 0}</div>
              <div className="text-gray-400">Ranked Players</div>
            </div>
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center gap-4">
            <Award className="text-pink-500" size={32} />
            <div>
              <div className="text-3xl font-bold">{stats?.recentlyUpdated?.length || 0}</div>
              <div className="text-gray-400">Recent Updates</div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search players..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field w-full pl-12"
          />
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Add Player
        </button>
      </div>

      {/* Players Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left">Player</th>
                <th className="px-6 py-4 text-left">Overall</th>
                <th className="px-6 py-4 text-left">Last Updated</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlayers.map((player) => (
                <tr key={player.id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={player.skin_url} alt={player.username} className="w-10 h-20 object-cover rounded" />
                      <span className="font-semibold">{player.username}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <TierBadge tier={player.overall_tier} />
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(player.updated_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEditModal(player)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <Edit size={18} className="text-blue-400" />
                      </button>
                      <button onClick={() => { setDeletingPlayer(player); setShowDeleteConfirm(true); }} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <Trash2 size={18} className="text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="glass-card p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Add Player</h2>
            <form onSubmit={handleAddPlayer}>
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="input-field w-full"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Overall Tier</label>
                <select
                  value={formData.overall_tier}
                  onChange={(e) => setFormData({ ...formData, overall_tier: e.target.value })}
                  className="input-field w-full"
                >
                  {ALL_TIERS.map(tier => <option key={tier} value={tier}>{tier}</option>)}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Region</label>
                <select
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="input-field w-full"
                >
                  <option value="">Select Region</option>
                  <option value="NA">NA (North America)</option>
                  <option value="EU">EU (Europe)</option>
                  <option value="AS">AS (Asia)</option>
                  <option value="SA">SA (South America)</option>
                  <option value="OC">OC (Oceania)</option>
                  <option value="AF">AF (Africa)</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                {GAMEMODES.map(mode => (
                  <div key={mode.key}>
                    <label className="block text-gray-400 mb-2">{mode.emoji} {mode.name}</label>
                    <select
                      value={formData[mode.key]}
                      onChange={(e) => setFormData({ ...formData, [mode.key]: e.target.value })}
                      className="input-field w-full"
                    >
                      {ALL_TIERS.map(tier => <option key={tier} value={tier}>{tier}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-gray-400 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input-field w-full h-24"
                />
              </div>

              <div className="flex gap-4">
                <button type="submit" className="btn-primary flex-1">Add Player</button>
                <button type="button" onClick={() => { setShowAddModal(false); resetForm(); }} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingPlayer && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="glass-card p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Edit Player: {editingPlayer.username}</h2>
            <form onSubmit={handleEditPlayer}>
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="input-field w-full"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Overall Tier</label>
                <select
                  value={formData.overall_tier}
                  onChange={(e) => setFormData({ ...formData, overall_tier: e.target.value })}
                  className="input-field w-full"
                >
                  {ALL_TIERS.map(tier => <option key={tier} value={tier}>{tier}</option>)}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Region</label>
                <select
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="input-field w-full"
                >
                  <option value="">Select Region</option>
                  <option value="NA">NA (North America)</option>
                  <option value="EU">EU (Europe)</option>
                  <option value="AS">AS (Asia)</option>
                  <option value="SA">SA (South America)</option>
                  <option value="OC">OC (Oceania)</option>
                  <option value="AF">AF (Africa)</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                {GAMEMODES.map(mode => (
                  <div key={mode.key}>
                    <label className="block text-gray-400 mb-2">{mode.emoji} {mode.name}</label>
                    <select
                      value={formData[mode.key]}
                      onChange={(e) => setFormData({ ...formData, [mode.key]: e.target.value })}
                      className="input-field w-full"
                    >
                      {ALL_TIERS.map(tier => <option key={tier} value={tier}>{tier}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-gray-400 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input-field w-full h-24"
                />
              </div>

              <div className="flex gap-4">
                <button type="submit" className="btn-primary flex-1">Update Player</button>
                <button type="button" onClick={() => { setShowEditModal(false); setEditingPlayer(null); resetForm(); }} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && deletingPlayer && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="glass-card p-6 w-full max-w-md animate-fade-in">
            <h2 className="text-2xl font-bold mb-4">Confirm Delete</h2>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete <span className="text-white font-semibold">{deletingPlayer.username}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button onClick={handleDeletePlayer} className="btn-danger flex-1">Delete</button>
              <button onClick={() => { setShowDeleteConfirm(false); setDeletingPlayer(null); }} className="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
};

export default AdminDashboard;
