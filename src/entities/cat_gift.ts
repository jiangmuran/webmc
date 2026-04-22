// Cat gift. When owner sleeps in a bed near a tamed cat, the cat may
// bring a gift at sunrise (12.5% chance). 9 possible gifts.

export type CatGift =
  | 'webmc:rabbit_foot'
  | 'webmc:rabbit_hide'
  | 'webmc:raw_chicken'
  | 'webmc:feather'
  | 'webmc:raw_fish'
  | 'webmc:rotten_flesh'
  | 'webmc:string'
  | 'webmc:phantom_membrane'
  | 'webmc:raw_salmon';

const GIFTS: readonly CatGift[] = [
  'webmc:rabbit_foot',
  'webmc:rabbit_hide',
  'webmc:raw_chicken',
  'webmc:feather',
  'webmc:raw_fish',
  'webmc:rotten_flesh',
  'webmc:string',
  'webmc:phantom_membrane',
  'webmc:raw_salmon',
];

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
  if (q.rng() >= 0.125) return { givesGift: false, gift: null };
  const idx = Math.floor(q.rng() * GIFTS.length);
  return { givesGift: true, gift: GIFTS[idx] ?? 'webmc:string' };
}
