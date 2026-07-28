import { TIER_COLORS } from '../utils/tiers';

const TierBadge = ({ tier }) => {
  const colorClass = TIER_COLORS[tier] || 'bg-gray-500';
  
  return (
    <span className={`tier-badge ${colorClass} text-white`}>
      {tier || 'Unranked'}
    </span>
  );
};

export default TierBadge;
