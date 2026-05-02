// Zombie→villager cure progression. Weakness + golden apple starts
// a 3-5 minute countdown during which the zombie villager shakes.
//
// Wiki (minecraft.wiki/w/Zombie_Villager#Curing): each iron bar /
// bed half within range counts as one accelerant, capped at 14;
// having all 14 yields a 4.2% average speedup. Light/dark is NOT
// a wiki factor — old code's "dark + beds/iron → 2x speed" gave
// a 100% speedup, contrary to the wiki cap of 4.2%, and the
// dark-required gate has no wiki support.

export const CURE_MIN_TICKS = 3600;
export const CURE_MAX_TICKS = 6000;
export const ACCELERANT_CAP = 14;
export const SPEEDUP_PER_ACCELERANT = 0.003;

export interface CureProgress {
  ticksRemaining: number;
  inLight: boolean;
  nearbyBedsOrBars: number;
}

export function startCure(rand: () => number): CureProgress {
  const d = CURE_MIN_TICKS + Math.floor(rand() * (CURE_MAX_TICKS - CURE_MIN_TICKS + 1));
  return { ticksRemaining: d, inLight: false, nearbyBedsOrBars: 0 };
}

export function tick(p: CureProgress): CureProgress {
  const accel = Math.min(ACCELERANT_CAP, p.nearbyBedsOrBars);
  const speedup = 1 + accel * SPEEDUP_PER_ACCELERANT;
  return { ...p, ticksRemaining: Math.max(0, p.ticksRemaining - speedup) };
}

export function cured(p: CureProgress): boolean {
  return p.ticksRemaining <= 0;
}
