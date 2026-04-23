export interface Ctx {
  chunkInhabitedTicks: number;
  daysPlayed: number;
  isMoonFull: boolean;
  baseDifficulty: 'peaceful' | 'easy' | 'normal' | 'hard';
}

export function regionalDifficulty(c: Ctx): number {
  if (c.baseDifficulty === 'peaceful') return 0;
  const baseMult = c.baseDifficulty === 'hard' ? 3 : c.baseDifficulty === 'normal' ? 2 : 1;
  const inhabit = Math.min(1, c.chunkInhabitedTicks / (3_600_000 / 50));
  const dayBonus = Math.min(0.75, c.daysPlayed / 32);
  const moonBonus = c.isMoonFull ? 0.25 : 0;
  return baseMult + inhabit * 0.75 + dayBonus + moonBonus;
}

export function clampedDifficulty(c: Ctx): number {
  return Math.max(0, Math.min(6.75, regionalDifficulty(c)));
}
