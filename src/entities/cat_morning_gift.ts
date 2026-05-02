// Tamed cats that slept on a bed may drop a small gift when the
// player wakes.
//
// Wiki (minecraft.wiki/w/Cat#Gifts): the cat_morning_gift loot table
// has 6 common items (weight 10, 16.13% each) and phantom membrane
// (weight 2, 3.22%). Old uniform 1/7 selection gave every item ~14.3%,
// which inflated phantom membrane to ~4.4× its wiki rate.

export const CAT_GIFT_CHANCE = 0.7;

interface GiftEntry {
  item: string;
  weight: number;
}

const CAT_GIFT_TABLE: readonly GiftEntry[] = [
  { item: 'rabbit_foot', weight: 10 },
  { item: 'rabbit_hide', weight: 10 },
  { item: 'string', weight: 10 },
  { item: 'feather', weight: 10 },
  { item: 'raw_chicken', weight: 10 },
  { item: 'rotten_flesh', weight: 10 },
  { item: 'phantom_membrane', weight: 2 },
];

// Back-compat: simple list of items, no weights. Tests that just check
// "is the result in the pool" still pass.
export const CAT_GIFT_POOL: readonly string[] = CAT_GIFT_TABLE.map((e) => e.item);

const TOTAL_WEIGHT = CAT_GIFT_TABLE.reduce((s, e) => s + e.weight, 0);

export function rollGift(rand: () => number): string | null {
  if (rand() >= CAT_GIFT_CHANCE) return null;
  let r = rand() * TOTAL_WEIGHT;
  for (const e of CAT_GIFT_TABLE) {
    r -= e.weight;
    if (r < 0) return e.item;
  }
  return CAT_GIFT_TABLE[CAT_GIFT_TABLE.length - 1]?.item ?? null;
}

export function catSleptOnBed(playerSleeping: boolean, adjacentToBed: boolean): boolean {
  return playerSleeping && adjacentToBed;
}

export function canGift(tamed: boolean, sleptOnBed: boolean): boolean {
  return tamed && sleptOnBed;
}
