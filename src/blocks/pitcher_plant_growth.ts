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

// Wiki (minecraft.wiki/w/Pitcher_Plant): "Pitcher plants do not
// generate naturally and are obtained by growing a pitcher pod.
// Breaking a fully grown pitcher crop drops one pitcher plant."
// Wiki (minecraft.wiki/w/Pitcher_Pod): "Mining a pitcher crop also
// drops the pitcher pod."
//
// Old harvestYield returned `2 + floor(random*2)` (i.e. 2-3) for
// mature crops — wiki canon is exactly 1 pitcher plant. Immature
// crop drops the original pod (1).
export function harvestYield(_age: PitcherCrop['age']): number {
  return 1;
}

export function isMature(c: PitcherCrop): boolean {
  return c.age >= PITCHER_MAX_AGE;
}
