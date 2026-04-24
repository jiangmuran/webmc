export interface BeeState {
  pollenLoaded: boolean;
  ticksOutsideHive: number;
  angeredAt?: string;
  dayCycleStage: 'day' | 'night';
}

export const POLLEN_PICKUP_RADIUS = 6;
export const MAX_TICKS_OUTSIDE_HIVE = 20 * 60 * 2;

export function shouldReturnHive(s: BeeState): boolean {
  if (s.angeredAt !== undefined) return false;
  if (s.dayCycleStage === 'night') return true;
  return s.pollenLoaded || s.ticksOutsideHive >= MAX_TICKS_OUTSIDE_HIVE;
}

export function growsCropBelow(blockIsCrop: boolean, s: BeeState, rng: () => number): boolean {
  if (!s.pollenLoaded) return false;
  if (!blockIsCrop) return false;
  return rng() < 1 / 30;
}

export function incrementHoneyLevel(currentLevel: number, returning: boolean): number {
  return returning ? Math.min(5, currentLevel + 1) : currentLevel;
}
