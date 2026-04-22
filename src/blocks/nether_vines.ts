// Twisting + weeping vines. Twisting vines grow upward in the Warped
// Forest biome; weeping vines grow downward in the Crimson Forest.
// Both can be climbed.

export type NetherVineDirection = 'up' | 'down';

export interface NetherVineColumn {
  direction: NetherVineDirection;
  length: number;
  maxLength: number;
}

export function makeNetherVine(direction: NetherVineDirection): NetherVineColumn {
  return { direction, length: 1, maxLength: 26 };
}

const GROWTH_CHANCE = 0.1;

export interface VineLookup {
  hasAir(x: number, y: number, z: number): boolean;
}

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export function growNetherVine(
  base: Vec3,
  state: NetherVineColumn,
  lookup: VineLookup,
  rng: () => number = Math.random,
): Vec3 | null {
  if (state.length >= state.maxLength) return null;
  if (rng() >= GROWTH_CHANCE) return null;
  const tipY = state.direction === 'up' ? base.y + state.length : base.y - state.length;
  const next = {
    x: base.x,
    y: state.direction === 'up' ? tipY + 1 : tipY - 1,
    z: base.z,
  };
  if (!lookup.hasAir(next.x, next.y, next.z)) return null;
  state.length++;
  return next;
}

// Bone meal grows the vine by 1-5.
export function boneMealVine(
  base: Vec3,
  state: NetherVineColumn,
  lookup: VineLookup,
  rng: () => number = Math.random,
): readonly Vec3[] {
  const placements: Vec3[] = [];
  const bump = 1 + Math.floor(rng() * 5);
  for (let i = 0; i < bump; i++) {
    const out = growNetherVine(base, state, lookup, () => 0);
    if (!out) break;
    placements.push(out);
  }
  return placements;
}
