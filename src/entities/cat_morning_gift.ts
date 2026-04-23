// Tamed cats that slept on a bed may drop a small gift when the
// player wakes.

export const CAT_GIFT_CHANCE = 0.7;

export const CAT_GIFT_POOL = [
  'rabbit_foot',
  'rabbit_hide',
  'string',
  'feather',
  'raw_chicken',
  'rotten_flesh',
  'phantom_membrane',
];

export function rollGift(rand: () => number): string | null {
  if (rand() >= CAT_GIFT_CHANCE) return null;
  const idx = Math.floor(rand() * CAT_GIFT_POOL.length);
  return CAT_GIFT_POOL[idx] ?? null;
}

export function catSleptOnBed(playerSleeping: boolean, adjacentToBed: boolean): boolean {
  return playerSleeping && adjacentToBed;
}

export function canGift(tamed: boolean, sleptOnBed: boolean): boolean {
  return tamed && sleptOnBed;
}
