// Zombie→villager cure progression. Weakness + golden apple starts
// a 3-5 minute countdown during which the zombie villager shakes.

export const CURE_MIN_TICKS = 3600;
export const CURE_MAX_TICKS = 6000;

export interface CureProgress {
  ticksRemaining: number;
  inLight: boolean;
  nearbyBedsOrBars: number;
}

export function startCure(rand: () => number): CureProgress {
  const d = CURE_MIN_TICKS + Math.floor(rand() * (CURE_MAX_TICKS - CURE_MIN_TICKS));
  return { ticksRemaining: d, inLight: false, nearbyBedsOrBars: 0 };
}

export function tick(p: CureProgress): CureProgress {
  let delta = 1;
  // Dark + beds/iron bars nearby accelerate (~2x)
  if (!p.inLight && p.nearbyBedsOrBars > 0) delta = 2;
  return { ...p, ticksRemaining: Math.max(0, p.ticksRemaining - delta) };
}

export function cured(p: CureProgress): boolean {
  return p.ticksRemaining <= 0;
}
