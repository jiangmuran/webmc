// Fishing rod. Right-click casts bobber. Waits for bite; pulls in
// catch. Lure enchantment reduces wait; Luck of the Sea improves rarity.

export interface FishingAttempt {
  lureLevel: number;
  luckOfTheSeaLevel: number;
  rainingAbove: boolean;
  rand: () => number;
}

export function waitTicks(a: FishingAttempt): number {
  const base = 100 + Math.floor(a.rand() * 500); // 5s..30s
  const lureMs = a.lureLevel * 5 * 20;
  const rainMod = a.rainingAbove ? -100 : 0;
  return Math.max(20, base - lureMs + rainMod);
}

export type Rarity = 'fish' | 'treasure' | 'junk';

// Wiki (minecraft.wiki/w/Luck_of_the_Sea): "Each level of Luck of
// the Sea reduces the chance of getting junk by 2.1% and increases
// the chance of getting treasure by 2%." Old junk reduction 0.025
// (2.5%) was slightly over-aggressive; sibling
// fishing_rod_reel_drops.ts uses the wiki-canonical 0.021.
export function rollRarity(a: FishingAttempt): Rarity {
  const loot = a.luckOfTheSeaLevel;
  const r = a.rand();
  const treasure = 0.05 + 0.02 * loot;
  const junk = Math.max(0, 0.1 - 0.021 * loot);
  if (r < treasure) return 'treasure';
  if (r < treasure + junk) return 'junk';
  return 'fish';
}

export const FISHING_ROD_MAX_DURABILITY = 64;
