// Chicken jockey. Tiny zombie riding a chicken; rare spawn.
//
// Wiki (minecraft.wiki/w/Zombie#Jockeys): "every baby zombie has a
// chance to spawn as a chicken jockey. In a chicken-free environment,
// each baby has a 4.75% chance of spawning as a chicken jockey."
// Old constant 5% was rounded; the canonical value is 4.75%.

export interface JockeyQuery {
  babyZombieSpawning: boolean;
  rand: () => number;
}

export const JOCKEY_CHANCE = 0.0475;

export function shouldBeJockey(q: JockeyQuery): boolean {
  if (!q.babyZombieSpawning) return false;
  return q.rand() < JOCKEY_CHANCE;
}

// If a zombie is below y=40 and the chicken egg hatches, spawn a
// chicken jockey instead.
export function hatchIntoJockey(eggY: number, rand: () => number): boolean {
  if (eggY >= 40) return false;
  return rand() < 0.01;
}

// Skeleton jockey (horse + skeleton rider) during thunderstorm.
export function shouldSkeletonJockey(thunder: boolean, rand: () => number): boolean {
  if (!thunder) return false;
  return rand() < 0.008;
}
