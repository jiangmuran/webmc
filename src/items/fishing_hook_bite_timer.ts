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
  const base = MIN_WAIT_TICKS + Math.floor(rng() * (MAX_WAIT_TICKS - MIN_WAIT_TICKS));
  return Math.max(MIN_WAIT_TICKS, base - lureLevel * 100);
}

export function isBiting(s: HookState): boolean {
  if (!s.openSkyAbove) return false;
  return s.ticksInWater >= s.waitTicks;
}
