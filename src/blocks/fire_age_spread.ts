// Fire age + spread. Fire has an age 0..15; increments until max,
// then burns out. Spreads to nearby flammable blocks with probability
// scaled by flammability.

// Wiki (minecraft.wiki/w/Fire): every wood-family planks/log/leaves
// is flammable, plus wool, tnt, hay_block, coal_block, bamboo, vines,
// short/tall grass, fern, bookshelf, dried_kelp_block, bed.
//
// Old table only listed oak — fire ignited oak forests but the same
// fire next to a spruce log silently did nothing. Sibling
// fire_spread.ts already covers all 9 wood types via a list-driven
// fill; this module now matches.
const FLAMMABILITY: Record<string, { encouragement: number; flammability: number }> = {
  'webmc:wool': { encouragement: 30, flammability: 60 },
  'webmc:tnt': { encouragement: 15, flammability: 100 },
  'webmc:hay_block': { encouragement: 60, flammability: 20 },
  'webmc:coal_block': { encouragement: 5, flammability: 5 },
  'webmc:bookshelf': { encouragement: 30, flammability: 20 },
  'webmc:dried_kelp_block': { encouragement: 30, flammability: 60 },
  'webmc:bamboo': { encouragement: 60, flammability: 60 },
  'webmc:bamboo_block': { encouragement: 5, flammability: 5 },
  'webmc:vine': { encouragement: 15, flammability: 100 },
  'webmc:short_grass': { encouragement: 60, flammability: 100 },
  'webmc:tall_grass': { encouragement: 60, flammability: 100 },
  'webmc:fern': { encouragement: 60, flammability: 100 },
  'webmc:large_fern': { encouragement: 60, flammability: 100 },
  'webmc:bed': { encouragement: 5, flammability: 20 },
};
const FLAMMABLE_WOODS = [
  'oak',
  'spruce',
  'birch',
  'jungle',
  'acacia',
  'dark_oak',
  'cherry',
  'mangrove',
  'pale_oak',
];
for (const w of FLAMMABLE_WOODS) {
  FLAMMABILITY[`webmc:${w}_log`] = { encouragement: 5, flammability: 5 };
  FLAMMABILITY[`webmc:${w}_planks`] = { encouragement: 5, flammability: 20 };
  FLAMMABILITY[`webmc:${w}_leaves`] = { encouragement: 30, flammability: 60 };
  FLAMMABILITY[`webmc:stripped_${w}_log`] = { encouragement: 5, flammability: 5 };
}

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

// Wiki (minecraft.wiki/w/Fire): "Fire is extinguished by rain
// immediately, regardless of humidity, age, or block underneath
// (except infinite-fuel blocks which don't see rain)." Old code
// rolled a 20% chance to burn out under rain, leaving fires alive
// 80% of ticks during a thunderstorm. Humid biomes slow spread but
// do NOT cause burn-out — that branch was dropping fire 20% of the
// time in jungles too. Sibling fire_burnout_age.ts already
// extinguishes unconditionally on rain.
export function tickFire(q: FireTickQuery): TickResult {
  if (q.isRaining) return 'burn_out';
  void q.humidityIsHigh;
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
