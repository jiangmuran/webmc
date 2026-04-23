export interface ReinforceCtx {
  difficulty: 'peaceful' | 'easy' | 'normal' | 'hard';
  rng: () => number;
  zombieAttackCount: number;
}

export const HARD_CHANCE = 0.1;
export const NORMAL_CHANCE = 0.05;

export function shouldSpawnReinforcement(c: ReinforceCtx): boolean {
  if (c.difficulty !== 'hard' && c.difficulty !== 'normal') return false;
  const p = c.difficulty === 'hard' ? HARD_CHANCE : NORMAL_CHANCE;
  const scaled = p * Math.min(2, 1 + c.zombieAttackCount * 0.05);
  return c.rng() < scaled;
}
