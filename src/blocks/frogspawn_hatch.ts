// Frogspawn: laid on water surface after frog breeding. Hatches
// into tadpoles after a random delay. Breaks if water removed.

export interface Frogspawn {
  hatchAtTick: number;
  waterBelow: boolean;
}

export const FROGSPAWN_MIN_HATCH_TICKS = 3600;
export const FROGSPAWN_MAX_HATCH_TICKS = 12000;
export const TADPOLES_PER_SPAWN_MIN = 2;
export const TADPOLES_PER_SPAWN_MAX = 6;

export function scheduleHatch(nowTick: number, rand: () => number): number {
  const r = rand();
  const delay = Math.floor(
    FROGSPAWN_MIN_HATCH_TICKS + r * (FROGSPAWN_MAX_HATCH_TICKS - FROGSPAWN_MIN_HATCH_TICKS),
  );
  return nowTick + delay;
}

export function readyToHatch(f: Frogspawn, nowTick: number): boolean {
  return f.waterBelow && nowTick >= f.hatchAtTick;
}

export function hatchCount(rand: () => number): number {
  const r = rand();
  return Math.floor(
    TADPOLES_PER_SPAWN_MIN + r * (TADPOLES_PER_SPAWN_MAX - TADPOLES_PER_SPAWN_MIN + 1),
  );
}

export function breaksWithoutWater(f: Frogspawn): boolean {
  return !f.waterBelow;
}
