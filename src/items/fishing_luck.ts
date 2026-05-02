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

// Wiki (minecraft.wiki/w/Luck_of_the_Sea): LotS moves weight from
// the junk pool to the treasure pool in equal amounts, roughly
// +2.0/-2.0 percentage points per level. Wiki's table at LotS III:
// fish 84.7%, treasure 11.2%, junk 4.1%. Old formula boosted
// treasure by `luckBoost*2` (= 4 per level) AND deducted that boost
// from fish too — at LotS III the code returned treasure 17 (wiki
// 11), fish 79 (wiki 85). Now treasure's gain equals junk's loss;
// fish stays at the wiki-correct ~85.
export function computeCategoryWeights(q: FishingEnchantQuery): CategoryWeights {
  const base = { fish: 85, treasure: 5, junk: 10 };
  const luckBoost = q.luckOfTheSea * 2 + q.luckEffect;
  const junkLoss = Math.min(base.junk, luckBoost);
  return {
    fish: base.fish,
    treasure: base.treasure + junkLoss,
    junk: base.junk - junkLoss,
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

// Wiki (minecraft.wiki/w/Fishing): treasure pool has exactly 6 items
// at equal 16.7% (1/6) weight each — Bow, Enchanted Book, Fishing
// Rod, Name Tag, Nautilus Shell, Saddle. Old code added `lily_pad`
// as a 7th treasure item (~14.3% chance), but wiki places lily_pad
// in the JUNK pool, not treasure. Including it here both stole 14%
// of treasure rolls from canonical items AND let players "fish"
// lily pads as treasure (an oddly common build resource that wiki
// never offered as treasure).
export type TreasureItem =
  | 'webmc:enchanted_book'
  | 'webmc:enchanted_bow'
  | 'webmc:enchanted_fishing_rod'
  | 'webmc:name_tag'
  | 'webmc:saddle'
  | 'webmc:nautilus_shell';

const TREASURE_POOL: readonly { item: TreasureItem; weight: number }[] = [
  { item: 'webmc:enchanted_bow', weight: 1 },
  { item: 'webmc:enchanted_book', weight: 1 },
  { item: 'webmc:enchanted_fishing_rod', weight: 1 },
  { item: 'webmc:name_tag', weight: 1 },
  { item: 'webmc:nautilus_shell', weight: 1 },
  { item: 'webmc:saddle', weight: 1 },
];

export function pickTreasureItem(roll: number): TreasureItem {
  const idx = Math.min(TREASURE_POOL.length - 1, Math.floor(roll * TREASURE_POOL.length));
  return TREASURE_POOL[idx]?.item ?? 'webmc:name_tag';
}
