// Villager trade tier. Each successful trade adds XP; reaching
// thresholds promotes tier (novice → apprentice → journeyman → expert
// → master).

export type TradeTier = 'novice' | 'apprentice' | 'journeyman' | 'expert' | 'master';

export const TIER_THRESHOLDS: { tier: TradeTier; xp: number }[] = [
  { tier: 'novice', xp: 0 },
  { tier: 'apprentice', xp: 10 },
  { tier: 'journeyman', xp: 70 },
  { tier: 'expert', xp: 150 },
  { tier: 'master', xp: 250 },
];

export function tierForXp(xp: number): TradeTier {
  let current: TradeTier = 'novice';
  for (const t of TIER_THRESHOLDS) {
    if (xp >= t.xp) current = t.tier;
  }
  return current;
}

export function xpPerSuccessfulTrade(): number {
  return 2;
}

export function nextThreshold(currentXp: number): number | null {
  for (const t of TIER_THRESHOLDS) {
    if (currentXp < t.xp) return t.xp;
  }
  return null;
}

export function unlockedTrades(tier: TradeTier): number {
  const idx = TIER_THRESHOLDS.findIndex((t) => t.tier === tier);
  return (idx + 1) * 2; // 2 trades per tier
}
