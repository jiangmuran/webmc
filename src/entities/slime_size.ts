// Slime / magma cube size variants. Sizes 1 (tiny), 2 (small), 4 (large).
// Killing a non-tiny slime spawns 2-4 smaller slimes.

export type SlimeSize = 1 | 2 | 4;

export interface SlimeVariantState {
  size: SlimeSize;
  hp: number;
  attackDamage: number;
}

export function makeSlimeVariant(size: SlimeSize = 2): SlimeVariantState {
  return {
    size,
    hp: size * size,
    attackDamage: size === 4 ? 4 : size === 2 ? 2 : 0,
  };
}

export interface KillResult {
  spawnedSizes: readonly SlimeSize[];
}

export function splitSlime(state: SlimeVariantState, rng: () => number = Math.random): KillResult {
  if (state.size === 1) return { spawnedSizes: [] };
  const count = 2 + Math.floor(rng() * 3); // 2..4
  const next: SlimeSize = state.size === 4 ? 2 : 1;
  return { spawnedSizes: Array.from({ length: count }, () => next) };
}

export function slimeAabbSize(size: SlimeSize): number {
  return size * 0.51;
}
