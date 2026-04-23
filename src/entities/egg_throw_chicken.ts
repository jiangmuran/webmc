export const CHICKEN_CHANCE = 0.125;
export const FOUR_CHICKEN_CHANCE = 1 / 256;

export function hatchedChicks(rng: () => number): number {
  if (rng() >= CHICKEN_CHANCE) return 0;
  if (rng() < FOUR_CHICKEN_CHANCE) return 4;
  return 1;
}

export function passesThroughWater(): boolean {
  return false;
}

export function harmless(): boolean {
  return true;
}
