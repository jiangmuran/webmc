// Villager career levels. Matches MC's 5-tier progression; unlocks new
// trades at each level up. Levels are earned by trading (villager gets
// XP per transaction).

export type VillagerTier = 'novice' | 'apprentice' | 'journeyman' | 'expert' | 'master';

const TIER_ORDER: readonly VillagerTier[] = [
  'novice',
  'apprentice',
  'journeyman',
  'expert',
  'master',
];

const TIER_XP_THRESHOLDS: Record<VillagerTier, number> = {
  novice: 0,
  apprentice: 10,
  journeyman: 70,
  expert: 150,
  master: 250,
};

export function tierFor(xp: number): VillagerTier {
  let current: VillagerTier = 'novice';
  for (const tier of TIER_ORDER) {
    if (xp >= TIER_XP_THRESHOLDS[tier]) current = tier;
  }
  return current;
}

export function tierIndex(tier: VillagerTier): number {
  return TIER_ORDER.indexOf(tier);
}

// Offers unlocked per tier (integer count — e.g. novice shows 2, ... master 6).
const OFFERS_UNLOCKED: Record<VillagerTier, number> = {
  novice: 2,
  apprentice: 3,
  journeyman: 4,
  expert: 5,
  master: 6,
};

export function offersUnlocked(tier: VillagerTier): number {
  return OFFERS_UNLOCKED[tier];
}
