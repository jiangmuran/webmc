export interface SpawnCtx {
  difficulty: 'peaceful' | 'easy' | 'normal' | 'hard';
  rng: () => number;
}

export const BASE_CHANCE = 0.01;

export function isSpiderJockey(c: SpawnCtx): boolean {
  if (c.difficulty === 'peaceful') return false;
  return c.rng() < BASE_CHANCE;
}

export function riderEntity(): 'skeleton' {
  return 'skeleton';
}

export function riderInheritsBowEnchant(): boolean {
  return true;
}
