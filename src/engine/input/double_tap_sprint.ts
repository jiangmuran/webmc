export interface Tap {
  tickPressed: number;
  tickReleased: number;
}

export const MAX_INTERVAL_TICKS = 8;

export function isDoubleTap(prev: Tap, next: Tap): boolean {
  if (next.tickPressed < prev.tickReleased) return false;
  return next.tickPressed - prev.tickReleased <= MAX_INTERVAL_TICKS;
}

export function startsSprint(isDouble: boolean, hungerLevel: number): boolean {
  return isDouble && hungerLevel > 6;
}
