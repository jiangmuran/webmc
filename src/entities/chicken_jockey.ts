// Chicken jockey. Tiny zombie riding a chicken; rare spawn (~5% of
// baby zombie spawns).

export interface JockeyQuery {
  babyZombieSpawning: boolean;
  rand: () => number;
}

export const JOCKEY_CHANCE = 0.05;

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
