export interface SpawnCtx {
  rollSpiderJockey: number;
  rollChickenJockey: number;
  difficulty: 'peaceful' | 'easy' | 'normal' | 'hard';
}

export const SPIDER_JOCKEY_CHANCE = 0.01;
// Wiki (minecraft.wiki/w/Zombie#Jockeys): chicken jockey chance is
// 4.75% per baby zombie spawn (chicken-free environment). Old 5%
// was rounded; sibling chicken_jockey.ts now matches this value.
export const CHICKEN_JOCKEY_CHANCE = 0.0475;

export function isSpiderJockey(c: SpawnCtx): boolean {
  if (c.difficulty === 'peaceful') return false;
  return c.rollSpiderJockey < SPIDER_JOCKEY_CHANCE;
}

export function isChickenJockey(c: SpawnCtx): boolean {
  if (c.difficulty === 'peaceful') return false;
  return c.rollChickenJockey < CHICKEN_JOCKEY_CHANCE;
}
