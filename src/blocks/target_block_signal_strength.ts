export interface ProjectileHit {
  distanceFromCenter: number;
}

export const BLOCK_RADIUS = 0.5;

export function signalFromDistance(d: number): number {
  if (d > BLOCK_RADIUS) return 0;
  const normalized = 1 - d / BLOCK_RADIUS;
  return Math.max(1, Math.ceil(normalized * 15));
}

export const SIGNAL_DURATION_ARROW = 20;
export const SIGNAL_DURATION_THROWABLE = 8;
