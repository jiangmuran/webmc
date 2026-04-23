export interface Ctx {
  inCave: boolean;
  lightLevel: number;
  ticksSinceLastAmbient: number;
}

export const MIN_TICKS_BETWEEN = 6000;
export const CHANCE_PER_ROLL = 0.004;

export function canPlayAmbient(c: Ctx, rng: () => number): boolean {
  if (!c.inCave) return false;
  if (c.lightLevel > 0) return false;
  if (c.ticksSinceLastAmbient < MIN_TICKS_BETWEEN) return false;
  return rng() < CHANCE_PER_ROLL;
}
