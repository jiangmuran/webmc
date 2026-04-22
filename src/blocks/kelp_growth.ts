// Kelp growth. Kelp plants in water grow upward, one block per tick with
// small chance. Max length 26. Bone meal grows 1-2.

export interface KelpColumn {
  baseY: number;
  length: number;
}

const MAX_LENGTH = 26;
const GROWTH_CHANCE = 0.07;

export function makeKelp(baseY: number): KelpColumn {
  return { baseY, length: 1 };
}

export interface KelpLookup {
  isWater(x: number, y: number, z: number): boolean;
}

export interface KelpGrowth {
  grew: boolean;
  newTipY: number | null;
}

export function tickKelp(
  base: { x: number; z: number },
  state: KelpColumn,
  lookup: KelpLookup,
  rng: () => number = Math.random,
): KelpGrowth {
  if (state.length >= MAX_LENGTH) return { grew: false, newTipY: null };
  if (rng() >= GROWTH_CHANCE) return { grew: false, newTipY: null };
  const newY = state.baseY + state.length;
  if (!lookup.isWater(base.x, newY, base.z)) return { grew: false, newTipY: null };
  state.length++;
  return { grew: true, newTipY: newY };
}

export function boneMealKelp(
  base: { x: number; z: number },
  state: KelpColumn,
  lookup: KelpLookup,
  rng: () => number = Math.random,
): readonly number[] {
  const bump = 1 + Math.floor(rng() * 2);
  const placements: number[] = [];
  for (let i = 0; i < bump && state.length < MAX_LENGTH; i++) {
    const r = tickKelp(base, state, lookup, () => 0);
    if (r.newTipY !== null) placements.push(r.newTipY);
  }
  return placements;
}
