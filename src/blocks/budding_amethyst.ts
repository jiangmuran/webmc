export type Stage = 'small' | 'medium' | 'large' | 'cluster';

export const GROW_CHANCE = 0.2;

export function nextStage(s: Stage): Stage {
  if (s === 'small') return 'medium';
  if (s === 'medium') return 'large';
  if (s === 'large') return 'cluster';
  return 'cluster';
}

export function pistonDestroys(): boolean {
  return true;
}

export function dropsSelfOnBreak(): boolean {
  return false;
}

export function canGrow(adjacentWaterOrAir: boolean, rng: () => number): boolean {
  return adjacentWaterOrAir && rng() < GROW_CHANCE;
}
