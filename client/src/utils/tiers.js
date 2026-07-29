export const TIER_COLORS = {
  'LT1': 'bg-green-500',
  'LT2': 'bg-blue-500',
  'LT3': 'bg-cyan-500',
  'LT4': 'bg-teal-500',
  'LT5': 'bg-emerald-500',
  'HT1': 'bg-purple-500',
  'HT2': 'bg-pink-500',
  'HT3': 'bg-orange-500',
  'HT4': 'bg-red-500',
  'HT5': 'bg-rose-600',
  'Low Tier': 'bg-green-600',
  'Mid Tier': 'bg-yellow-500',
  'High Tier': 'bg-red-600',
  'Unranked': 'bg-gray-500',
};

export const TIER_POINTS = {
  'HT1': 100,
  'LT1': 90,
  'HT2': 80,
  'LT2': 70,
  'HT3': 60,
  'LT3': 50,
  'HT4': 40,
  'LT4': 30,
  'HT5': 20,
  'LT5': 10,
  'Low Tier': 45,
  'Mid Tier': 35,
  'High Tier': 25,
  'Unranked': 0,
};

export const TIER_ORDER = ['HT1', 'LT1', 'HT2', 'LT2', 'HT3', 'LT3', 'HT4', 'LT4', 'HT5', 'LT5', 'Low Tier', 'Mid Tier', 'High Tier', 'Unranked'];

export const GAMEMODES = [
  { key: 'sword', name: 'Sword', emoji: '⚔️' },
  { key: 'axe', name: 'Axe', emoji: '🪓' },
  { key: 'spear', name: 'Spear', emoji: '🔱' },
  { key: 'mace', name: 'Mace', emoji: '☄️' },
  { key: 'spear_elytra', name: 'Spear Elytra', emoji: '🪽' },
  { key: 'uhc', name: 'UHC', emoji: '❤️' },
  { key: 'diamond_smp', name: 'Diamond SMP', emoji: '💎' },
  { key: 'nether_pot', name: 'Nether Pot', emoji: '🧪' },
  { key: 'crystals', name: 'Crystals', emoji: '💥' },
  { key: 'netherite_smp', name: 'Netherite SMP', emoji: '🛡️' },
  { key: 'cart', name: 'Cart', emoji: '🛒' },
];

export const ALL_TIERS = ['HT1', 'LT1', 'HT2', 'LT2', 'HT3', 'LT3', 'HT4', 'LT4', 'HT5', 'LT5', 'Low Tier', 'Mid Tier', 'High Tier', 'Unranked'];

export const calculateOverallPoints = (player) => {
  let totalPoints = 0;
  let rankedCount = 0;
  GAMEMODES.forEach(mode => {
    const tier = player[mode.key];
    if (tier && TIER_POINTS[tier] !== undefined && tier !== 'Unranked') {
      totalPoints += TIER_POINTS[tier];
      rankedCount++;
    }
  });
  return rankedCount > 0 ? totalPoints / rankedCount : 0;
};

export const getOverallTierFromPoints = (averagePoints) => {
  if (averagePoints >= 95) return 'HT1';
  if (averagePoints >= 85) return 'LT1';
  if (averagePoints >= 75) return 'HT2';
  if (averagePoints >= 65) return 'LT2';
  if (averagePoints >= 55) return 'HT3';
  if (averagePoints >= 45) return 'HT4';
  if (averagePoints >= 35) return 'LT3';
  if (averagePoints >= 25) return 'LT4';
  if (averagePoints >= 15) return 'HT5';
  if (averagePoints >= 5) return 'LT5';
  return 'Unranked';
};
