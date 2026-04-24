export type Difficulty = 'peaceful' | 'easy' | 'normal' | 'hard';

export function mobBaseDamageMultiplier(d: Difficulty): number {
  if (d === 'peaceful') return 0;
  if (d === 'easy') return 0.5;
  if (d === 'normal') return 1;
  return 1.5;
}

export function regionalDifficultyAdd(
  timeSpentInChunkTicks: number,
  worldDayCount: number,
): number {
  const timeFactor = Math.min(1, timeSpentInChunkTicks / (20 * 60 * 50));
  const dayFactor = Math.min(1, worldDayCount / 20);
  return 0.75 * timeFactor + 0.25 * dayFactor;
}

export function scaledDamage(base: number, d: Difficulty, regional: number): number {
  return base * mobBaseDamageMultiplier(d) * (1 + 0.5 * regional);
}
