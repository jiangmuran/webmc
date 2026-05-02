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

// Wiki (minecraft.wiki/w/Trading): "Java: villagers have a maximum
// of 10 trades. Each level unlocks a maximum of two new trades. ...
// A villager levels up when its experience bar becomes full and
// gains up to two (Java) or three (Bedrock) new trades and retains
// its existing trades."
//
// AGENT_CHARTER targets Java, so the cumulative offer count is
// 2 / 4 / 6 / 8 / 10 (novice → master). Old table was 2/3/4/5/6 —
// adding 1 per level instead of 2 — capping master villagers at 6
// trades when wiki canon allows 10.
const OFFERS_UNLOCKED: Record<VillagerTier, number> = {
  novice: 2,
  apprentice: 4,
  journeyman: 6,
  expert: 8,
  master: 10,
};

export function offersUnlocked(tier: VillagerTier): number {
  return OFFERS_UNLOCKED[tier];
}
