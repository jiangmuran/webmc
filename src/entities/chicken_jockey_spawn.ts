export interface SpawnCtx {
  rollSpiderJockey: number;
  rollChickenJockey: number;
  difficulty: 'peaceful' | 'easy' | 'normal' | 'hard';
}

export const SPIDER_JOCKEY_CHANCE = 0.01;
export const CHICKEN_JOCKEY_CHANCE = 0.05;

export function isSpiderJockey(c: SpawnCtx): boolean {
  if (c.difficulty === 'peaceful') return false;
  return c.rollSpiderJockey < SPIDER_JOCKEY_CHANCE;
}

export function isChickenJockey(c: SpawnCtx): boolean {
  if (c.difficulty === 'peaceful') return false;
  return c.rollChickenJockey < CHICKEN_JOCKEY_CHANCE;
}
