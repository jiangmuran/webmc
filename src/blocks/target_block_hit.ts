export const RADIUS_BULLSEYE = 0.15;
export const MAX_SIGNAL = 15;
export const SIGNAL_DURATION_TICKS = 7;

export function signalStrength(hitRadius: number): number {
  const inner = Math.max(0, Math.min(1, 1 - hitRadius));
  return Math.round(inner * MAX_SIGNAL);
}

export function boostsArrow(): boolean {
  return true;
}

export function signalFades(currentTick: number, hitAtTick: number): boolean {
  return currentTick - hitAtTick >= SIGNAL_DURATION_TICKS;
}
