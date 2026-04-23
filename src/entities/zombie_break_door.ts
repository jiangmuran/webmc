export interface ZombieBreakInput {
  difficulty: 'peaceful' | 'easy' | 'normal' | 'hard';
  isZombie: boolean;
  isVindicator: boolean;
  targetAccess: 'open' | 'locked';
}

export function canBreakDoor(i: ZombieBreakInput): boolean {
  if (i.targetAccess === 'open') return false;
  if (i.isVindicator) return true;
  if (!i.isZombie) return false;
  return i.difficulty === 'hard';
}

export const BREAK_TICKS = 240;

export function breakProgress(currentTicks: number, damageMultiplier: number): number {
  return Math.min(1, (currentTicks * damageMultiplier) / BREAK_TICKS);
}
