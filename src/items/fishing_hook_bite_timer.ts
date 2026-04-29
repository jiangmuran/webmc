export interface HookState {
  ticksInWater: number;
  waitTicks: number;
  lureLevel: number;
  luckLevel: number;
  openSkyAbove: boolean;
  rng: () => number;
}

export const MIN_WAIT_TICKS = 100;
export const MAX_WAIT_TICKS = 600;

export function initialWait(lureLevel: number, rng: () => number): number {
  // Wiki: rolled wait is uniform [100, 600] ticks; Lure subtracts 100
  // ticks per level. The result is floored at 0, not at MIN_WAIT_TICKS
  // — Lure III (-300) on a low roll is allowed to drop below 100.
  const base = MIN_WAIT_TICKS + Math.floor(rng() * (MAX_WAIT_TICKS - MIN_WAIT_TICKS));
  return Math.max(0, base - lureLevel * 100);
}

export function isBiting(s: HookState): boolean {
  if (!s.openSkyAbove) return false;
  return s.ticksInWater >= s.waitTicks;
}
