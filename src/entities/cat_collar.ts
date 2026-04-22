// Cat collar + variant. Tamed cats wear a collar (dye color) and
// display one of 11 breed variants inherited at random between parents.

import type { DyeColor } from '@/blocks/cauldron_dye';

export type CatVariant =
  | 'tabby'
  | 'tuxedo'
  | 'red'
  | 'siamese'
  | 'british_shorthair'
  | 'calico'
  | 'persian'
  | 'ragdoll'
  | 'white'
  | 'jellie'
  | 'black';

export const CAT_VARIANTS: readonly CatVariant[] = [
  'tabby',
  'tuxedo',
  'red',
  'siamese',
  'british_shorthair',
  'calico',
  'persian',
  'ragdoll',
  'white',
  'jellie',
  'black',
];

export interface CatState {
  id: number;
  tamed: boolean;
  ownerId: string | null;
  variant: CatVariant;
  collarColor: DyeColor;
  trusting: boolean;
}

export function makeCat(id: number, variant: CatVariant): CatState {
  return {
    id,
    tamed: false,
    ownerId: null,
    variant,
    collarColor: 'red',
    trusting: false,
  };
}

// Dyeing the collar: must be tamed, right-click with dye.
export interface DyeCollarQuery {
  state: CatState;
  dye: DyeColor;
}

export function dyeCollar(q: DyeCollarQuery): boolean {
  if (!q.state.tamed) return false;
  q.state.collarColor = q.dye;
  return true;
}

// Breeding: child's variant is randomly inherited from either parent.
export interface BreedCatQuery {
  parentA: CatVariant;
  parentB: CatVariant;
  rng: () => number;
}

export function breedCatVariant(q: BreedCatQuery): CatVariant {
  return q.rng() < 0.5 ? q.parentA : q.parentB;
}

// Cats "gift" their owner a small item each morning (if sleeping near).
export type CatGift =
  | 'webmc:rabbit_hide'
  | 'webmc:rabbit_foot'
  | 'webmc:chicken'
  | 'webmc:feather'
  | 'webmc:rotten_flesh'
  | 'webmc:phantom_membrane'
  | 'webmc:string';

const GIFT_POOL: readonly { item: CatGift; weight: number }[] = [
  { item: 'webmc:rabbit_hide', weight: 3 },
  { item: 'webmc:rabbit_foot', weight: 1 },
  { item: 'webmc:chicken', weight: 4 },
  { item: 'webmc:feather', weight: 4 },
  { item: 'webmc:rotten_flesh', weight: 3 },
  { item: 'webmc:phantom_membrane', weight: 1 },
  { item: 'webmc:string', weight: 4 },
];

export function rollCatGift(roll: number): CatGift {
  const total = GIFT_POOL.reduce((s, e) => s + e.weight, 0);
  const target = roll * total;
  let acc = 0;
  for (const e of GIFT_POOL) {
    acc += e.weight;
    if (target < acc) return e.item;
  }
  return 'webmc:string';
}
