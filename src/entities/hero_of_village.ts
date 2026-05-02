// Hero of the Village effect from winning a raid: villager discounts
// and occasional gifts.
//
// Wiki (minecraft.wiki/w/Hero_of_the_Village):
//   "Hero of the Village ... lasts 40 minutes."
//   "Level I decreases the cost of the first item in a villager trade
//    by 30% ... each additional level decreases the price by another
//    1/16 (6.25%) for a total price discount of 55% at level V."
//
// Old constants:
//   - HERO_DURATION_TICKS = 240,000 (200 minutes) — 5× the wiki value.
//   - tradePriceMultiplier per-level step = 0.06875 — wiki says 1/16
//     (= 0.0625) per additional level. At Hero V the old code gave a
//     57.5% discount vs wiki's 55%.

export const HERO_DURATION_TICKS = 40 * 60 * 20; // 40 minutes (= 48000 ticks)

export interface HeroCtx {
  level: number; // raid amplifier - 1
}

const BASE_DISCOUNT = 0.3;
const ADDITIONAL_PER_LEVEL = 1 / 16;

export function tradePriceMultiplier(level: number): number {
  const discount = BASE_DISCOUNT + Math.max(0, level) * ADDITIONAL_PER_LEVEL;
  // Wiki Level V (amplifier 4) → 55% discount → 0.45 multiplier; cap
  // at that floor so out-of-range commands don't drop prices below 0.
  return Math.max(0.45, 1 - discount);
}

export function villagerGiftChance(level: number): number {
  return Math.min(1, 0.02 * (level + 1));
}

export function hasEffect(ticksRemaining: number): boolean {
  return ticksRemaining > 0;
}
