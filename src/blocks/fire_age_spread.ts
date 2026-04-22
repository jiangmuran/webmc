// Fire age + spread. Fire has an age 0..15; increments until max,
// then burns out. Spreads to nearby flammable blocks with probability
// scaled by flammability.

const FLAMMABILITY: Record<string, { encouragement: number; flammability: number }> = {
  'webmc:oak_planks': { encouragement: 5, flammability: 20 },
  'webmc:oak_log': { encouragement: 5, flammability: 5 },
  'webmc:oak_leaves': { encouragement: 30, flammability: 60 },
  'webmc:wool': { encouragement: 30, flammability: 60 },
  'webmc:tnt': { encouragement: 15, flammability: 100 },
  'webmc:hay_block': { encouragement: 60, flammability: 20 },
  'webmc:coal_block': { encouragement: 5, flammability: 5 },
};

export function isFlammable(id: string): boolean {
  return id in FLAMMABILITY;
}

export function encouragement(id: string): number {
  return FLAMMABILITY[id]?.encouragement ?? 0;
}

export function flammability(id: string): number {
  return FLAMMABILITY[id]?.flammability ?? 0;
}

export const FIRE_AGE_MAX = 15;

export interface FireTickQuery {
  age: number;
  rand: () => number;
  isRaining: boolean;
  humidityIsHigh: boolean;
}

export type TickResult = 'age_up' | 'burn_out';

export function tickFire(q: FireTickQuery): TickResult {
  if (q.isRaining || q.humidityIsHigh) {
    if (q.rand() < 0.2) return 'burn_out';
  }
  if (q.age >= FIRE_AGE_MAX && q.rand() < 0.25) return 'burn_out';
  return 'age_up';
}

// Spread chance to a neighbor.
export interface SpreadQuery {
  targetBlockId: string;
  fireAge: number;
  rand: () => number;
}

export function tryIgniteNeighbor(q: SpreadQuery): boolean {
  const f = flammability(q.targetBlockId);
  if (f <= 0) return false;
  const chance = (f + 40) / 100; // simplified
  return q.rand() < chance;
}
