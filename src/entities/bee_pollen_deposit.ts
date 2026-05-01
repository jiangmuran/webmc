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

// Wiki (minecraft.wiki/w/Bee#Pollinating): "There is an approximately
// 5% chance each tick to attempt fertilization." Old `1/30` ≈ 3.33%
// per tick, ~33% under wiki — a bee carrying nectar over crops would
// fertilize them at two-thirds the canonical rate, slowing wheat /
// carrots / berries growth in farms with bee hives.
export const POLLEN_FERTILIZE_CHANCE = 0.05;

export function growsCropBelow(blockIsCrop: boolean, s: BeeState, rng: () => number): boolean {
  if (!s.pollenLoaded) return false;
  if (!blockIsCrop) return false;
  return rng() < POLLEN_FERTILIZE_CHANCE;
}

export function incrementHoneyLevel(currentLevel: number, returning: boolean): number {
  return returning ? Math.min(5, currentLevel + 1) : currentLevel;
}
