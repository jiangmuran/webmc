// Cat gift. When owner sleeps in a bed near a tamed cat, the cat may
// bring a gift at sunrise. 7 possible gifts per the cat_morning_gift
// loot table.
//
// Wiki (minecraft.wiki/w/Cat#Gifts):
//   "Tamed cats have a 70% chance of giving the player a gift when
//   they wake up from a bed."
//
//   Loot table cat_morning_gift.json:
//     Rabbit's foot     weight 10  (5/31, 16.13%)
//     Rabbit hide       weight 10  (5/31, 16.13%)
//     String            weight 10  (5/31, 16.13%)
//     Rotten flesh      weight 10  (5/31, 16.13%)
//     Feather           weight 10  (5/31, 16.13%)
//     Raw chicken       weight 10  (5/31, 16.13%)
//     Phantom membrane  weight  2  (1/31,  3.22%)
//
// Old gift list had 9 entries including raw_fish (cod) and raw_salmon
// — neither is in the wiki loot table. The uniform-pick across 9 also
// gave phantom_membrane the same weight as the others, vs the wiki's
// 5× rarer weighting.

export type CatGift =
  | 'webmc:rabbit_foot'
  | 'webmc:rabbit_hide'
  | 'webmc:string'
  | 'webmc:rotten_flesh'
  | 'webmc:feather'
  | 'webmc:raw_chicken'
  | 'webmc:phantom_membrane';

const GIFT_TABLE: readonly { item: CatGift; weight: number }[] = [
  { item: 'webmc:rabbit_foot', weight: 10 },
  { item: 'webmc:rabbit_hide', weight: 10 },
  { item: 'webmc:string', weight: 10 },
  { item: 'webmc:rotten_flesh', weight: 10 },
  { item: 'webmc:feather', weight: 10 },
  { item: 'webmc:raw_chicken', weight: 10 },
  { item: 'webmc:phantom_membrane', weight: 2 },
];
const GIFT_TOTAL_WEIGHT = 62;

export interface CatGiftQuery {
  ownerSleptNearby: boolean;
  rng: () => number;
}

export interface CatGiftResult {
  givesGift: boolean;
  gift: CatGift | null;
}

export function rollCatGift(q: CatGiftQuery): CatGiftResult {
  if (!q.ownerSleptNearby) return { givesGift: false, gift: null };
  if (q.rng() >= 0.7) return { givesGift: false, gift: null };
  let pick = q.rng() * GIFT_TOTAL_WEIGHT;
  for (const entry of GIFT_TABLE) {
    pick -= entry.weight;
    if (pick <= 0) return { givesGift: true, gift: entry.item };
  }
  return { givesGift: true, gift: 'webmc:string' };
}
