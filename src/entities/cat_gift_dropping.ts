// Tamed cat morning gifts. Overnight, a cat sleeping on/near its
// owner's bed may drop a gift on waking (70% chance).

export type CatGift =
  | 'webmc:rabbit_hide'
  | 'webmc:rabbit_foot'
  | 'webmc:string'
  | 'webmc:feather'
  | 'webmc:rotten_flesh'
  | 'webmc:phantom_membrane';

const GIFT_POOL: CatGift[] = [
  'webmc:rabbit_hide',
  'webmc:rabbit_foot',
  'webmc:string',
  'webmc:feather',
  'webmc:rotten_flesh',
  'webmc:phantom_membrane',
];

export const GIFT_CHANCE = 0.7;

export interface WakeQuery {
  ownerSlept: boolean;
  catSleepingNear: boolean;
  rand: () => number;
}

export function tryMorningGift(q: WakeQuery): CatGift | null {
  if (!q.ownerSlept || !q.catSleepingNear) return null;
  if (q.rand() >= GIFT_CHANCE) return null;
  const idx = Math.floor(q.rand() * GIFT_POOL.length);
  return GIFT_POOL[idx] ?? null;
}

// Cat purr bonus: owner sleeping near a cat gets Regeneration I for 5s.
export const PURR_REGEN_TICKS = 100;
