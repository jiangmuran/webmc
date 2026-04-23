// Pitcher plant. Grows from pitcher_pod; 4 ages; ages 2-3 span 2 blocks.

export interface PitcherCrop {
  age: 0 | 1 | 2 | 3 | 4;
  upperBlock: boolean;
}

export const PITCHER_MAX_AGE = 4;

export function tryGrow(c: PitcherCrop, rand: () => number): PitcherCrop {
  if (c.age >= PITCHER_MAX_AGE) return c;
  if (rand() > 0.1) return c;
  return { ...c, age: (c.age + 1) as PitcherCrop['age'] };
}

export function requiresUpperBlock(age: PitcherCrop['age']): boolean {
  return age >= 2;
}

export function harvestYield(age: PitcherCrop['age']): number {
  if (age < PITCHER_MAX_AGE) return 1; // returns seed
  return 2 + Math.floor(Math.random() * 2); // mature: pitcher_plant block
}

export function isMature(c: PitcherCrop): boolean {
  return c.age >= PITCHER_MAX_AGE;
}
