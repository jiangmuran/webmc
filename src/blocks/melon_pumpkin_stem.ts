export interface Stem {
  age: number;
  hasFruit: boolean;
  adjacentFarmland: number;
}

export const MAX_AGE = 7;

export function shouldGrowFruit(s: Stem): boolean {
  return s.age === MAX_AGE && !s.hasFruit && s.adjacentFarmland > 0;
}

export function growthChance(s: Stem): number {
  return s.adjacentFarmland > 0 ? 0.1 : 0;
}

export function detachedOnFruitBreak(): boolean {
  return true;
}
