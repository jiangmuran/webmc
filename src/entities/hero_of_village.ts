// Hero of the Village effect from winning a raid: villager discounts
// and occasional gifts.

export const HERO_DURATION_TICKS = 100 * 60 * 20 * 2; // 200 minutes

export interface HeroCtx {
  level: number; // raid amplifier - 1
}

export function tradePriceMultiplier(level: number): number {
  return Math.max(0.3, 1 - 0.3 - 0.06875 * level);
}

export function villagerGiftChance(level: number): number {
  return Math.min(1, 0.02 * (level + 1));
}

export function hasEffect(ticksRemaining: number): boolean {
  return ticksRemaining > 0;
}
