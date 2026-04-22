// Fishing hook. Cast travels as a projectile; when it lands in water
// with clear sky, begins the catch timer (5-30s, biased by Lure).

export interface Hook {
  inWater: boolean;
  catchTicksRemaining: number;
  lureLevel: number;
  luckLevel: number;
}

export function castHook(lureLevel: number, luckLevel: number, rand: () => number): Hook {
  const base = 100 + Math.floor(rand() * 500); // 5-30s in ticks
  const lureReduction = lureLevel * 100;
  return {
    inWater: false,
    catchTicksRemaining: Math.max(20, base - lureReduction),
    lureLevel,
    luckLevel,
  };
}

export function enterWater(h: Hook): void {
  h.inWater = true;
}

export function exitWater(h: Hook): void {
  h.inWater = false;
}

export interface TickResult {
  biteReady: boolean;
}

export function tickHook(h: Hook): TickResult {
  if (!h.inWater) return { biteReady: false };
  h.catchTicksRemaining = Math.max(0, h.catchTicksRemaining - 1);
  return { biteReady: h.catchTicksRemaining === 0 };
}

// Reeling while biteReady returns the catch; during normal flight
// returns no catch.
export type ReelResult = 'caught' | 'empty_line' | 'recast';

export function reel(h: Hook): ReelResult {
  if (h.catchTicksRemaining === 0 && h.inWater) return 'caught';
  if (!h.inWater) return 'recast';
  return 'empty_line';
}
