// Fishing Luck-of-the-Sea + Lure enchantments. Luck shifts the rarity
// distribution toward treasure; Lure shortens the wait time for a bite.
// Also exposes the category pool: fish (85%), treasure (5%), junk (10%),
// modified by enchants.

export interface FishingEnchantQuery {
  luckOfTheSea: number; // 0..3
  lure: number; // 0..3
  luckEffect: number; // +1 per level of Luck potion
}

export type FishingCategory = 'fish' | 'treasure' | 'junk';

export interface CategoryWeights {
  fish: number;
  treasure: number;
  junk: number;
}

export function computeCategoryWeights(q: FishingEnchantQuery): CategoryWeights {
  const base = { fish: 85, treasure: 5, junk: 10 };
  const luckBoost = q.luckOfTheSea * 2 + q.luckEffect;
  return {
    fish: Math.max(0, base.fish - luckBoost),
    treasure: base.treasure + luckBoost * 2,
    junk: Math.max(0, base.junk - luckBoost),
  };
}

export function pickCategory(w: CategoryWeights, roll: number): FishingCategory {
  const total = w.fish + w.treasure + w.junk;
  const target = roll * total;
  if (target < w.fish) return 'fish';
  if (target < w.fish + w.treasure) return 'treasure';
  return 'junk';
}

// Lure reduces wait by 5 seconds per level. Cap minimum wait at 1s.
const BASE_MIN_WAIT_SEC = 5;
const BASE_MAX_WAIT_SEC = 30;

export interface WaitQuery {
  lure: number;
  rng: () => number;
}

export function rollWaitSec(q: WaitQuery): number {
  const reduction = q.lure * 5;
  const min = Math.max(1, BASE_MIN_WAIT_SEC - reduction);
  const max = Math.max(min + 1, BASE_MAX_WAIT_SEC - reduction);
  return min + q.rng() * (max - min);
}

// Treasure items: enchanted book, name tag, saddle, enchanted bow, etc.
export type TreasureItem =
  | 'webmc:enchanted_book'
  | 'webmc:enchanted_bow'
  | 'webmc:enchanted_fishing_rod'
  | 'webmc:name_tag'
  | 'webmc:saddle'
  | 'webmc:nautilus_shell'
  | 'webmc:lily_pad';

const TREASURE_POOL: readonly { item: TreasureItem; weight: number }[] = [
  { item: 'webmc:enchanted_book', weight: 1 },
  { item: 'webmc:enchanted_bow', weight: 1 },
  { item: 'webmc:enchanted_fishing_rod', weight: 1 },
  { item: 'webmc:name_tag', weight: 1 },
  { item: 'webmc:saddle', weight: 1 },
  { item: 'webmc:nautilus_shell', weight: 1 },
  { item: 'webmc:lily_pad', weight: 1 },
];

export function pickTreasureItem(roll: number): TreasureItem {
  const idx = Math.min(TREASURE_POOL.length - 1, Math.floor(roll * TREASURE_POOL.length));
  return TREASURE_POOL[idx]?.item ?? 'webmc:name_tag';
}
