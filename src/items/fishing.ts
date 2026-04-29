// Fishing rod mechanics. On cast, the bobber drops into water; after a
// wait timer (5-30s, biased by luck / lure enchants), the rod returns a
// loot roll from the fishing table. Three sub-tables: fish (most common),
// treasure, and junk.

export type FishingPool = 'fish' | 'treasure' | 'junk';

export interface FishingDrop {
  item: string;
  count: number;
  weight: number;
  pool: FishingPool;
}

// Wiki (minecraft.wiki/w/Fishing): canonical fishing-loot weights.
// Fixes:
//  - 'raw_fish' / 'raw_salmon' (legacy 1.12 names) → cod / salmon (the
//    raw form in modern MC, registered in webmc as cod/salmon).
//  - pufferfish weight 13 → 2 (matches wiki; old 13 made pufferfish
//    catches ~10× too common).
//  - treasure pool entries weight 5 → 1 each (wiki: equal weights of
//    1; the 5 inflates total but the proportional split was already
//    even, so behaviour was OK — set to 1 for clarity and to match
//    fishing_treasure_table.ts).
//  - junk pool gains bamboo, bone, ink_sac, tripwire_hook from wiki.
export const FISHING_DROPS: readonly FishingDrop[] = [
  { item: 'webmc:cod', count: 1, weight: 60, pool: 'fish' },
  { item: 'webmc:salmon', count: 1, weight: 25, pool: 'fish' },
  { item: 'webmc:pufferfish', count: 1, weight: 2, pool: 'fish' },
  { item: 'webmc:tropical_fish', count: 1, weight: 2, pool: 'fish' },
  { item: 'webmc:bow', count: 1, weight: 1, pool: 'treasure' },
  { item: 'webmc:enchanted_book', count: 1, weight: 1, pool: 'treasure' },
  { item: 'webmc:fishing_rod', count: 1, weight: 1, pool: 'treasure' },
  { item: 'webmc:name_tag', count: 1, weight: 1, pool: 'treasure' },
  { item: 'webmc:nautilus_shell', count: 1, weight: 1, pool: 'treasure' },
  { item: 'webmc:saddle', count: 1, weight: 1, pool: 'treasure' },
  { item: 'webmc:lily_pad', count: 1, weight: 17, pool: 'junk' },
  { item: 'webmc:bowl', count: 1, weight: 10, pool: 'junk' },
  { item: 'webmc:leather', count: 1, weight: 10, pool: 'junk' },
  { item: 'webmc:leather_boots', count: 1, weight: 10, pool: 'junk' },
  { item: 'webmc:rotten_flesh', count: 1, weight: 10, pool: 'junk' },
  { item: 'webmc:stick', count: 1, weight: 5, pool: 'junk' },
  { item: 'webmc:string', count: 1, weight: 5, pool: 'junk' },
  { item: 'webmc:water_bottle', count: 1, weight: 10, pool: 'junk' },
  { item: 'webmc:bamboo', count: 1, weight: 10, pool: 'junk' },
  { item: 'webmc:bone', count: 1, weight: 10, pool: 'junk' },
  { item: 'webmc:ink_sac', count: 10, weight: 1, pool: 'junk' },
  { item: 'webmc:tripwire_hook', count: 1, weight: 10, pool: 'junk' },
];

// Weighted pool selection — treasure chance rises with Luck of the Sea
// enchant; junk chance drops.
export interface PoolWeights {
  fish: number;
  treasure: number;
  junk: number;
}

export function poolWeightsFor(luckOfTheSea: number): PoolWeights {
  // MC: each Luck of the Sea level: +2% treasure, -1% junk.
  return {
    fish: 85 - 2 * luckOfTheSea,
    treasure: 5 + 2 * luckOfTheSea,
    junk: 10 - luckOfTheSea,
  };
}

export function rollFishing(luckOfTheSea: number, rng: () => number = Math.random): FishingDrop {
  const w = poolWeightsFor(luckOfTheSea);
  const totalPoolWeight = w.fish + w.treasure + w.junk;
  const poolRoll = rng() * totalPoolWeight;
  const pool: FishingPool =
    poolRoll < w.fish ? 'fish' : poolRoll < w.fish + w.treasure ? 'treasure' : 'junk';
  const candidates = FISHING_DROPS.filter((d) => d.pool === pool);
  const totalWeight = candidates.reduce((s, d) => s + d.weight, 0);
  let pick = rng() * totalWeight;
  for (const d of candidates) {
    pick -= d.weight;
    if (pick <= 0) return d;
  }
  const fallback = candidates[0];
  if (!fallback) throw new Error(`empty pool ${pool}`);
  return fallback;
}

// Wait time in seconds before the bobber twitches. Lure enchant reduces
// per level.
export function waitTime(rng: () => number, lure: number): number {
  const base = 5 + rng() * 25;
  return Math.max(1, base - lure * 5);
}
