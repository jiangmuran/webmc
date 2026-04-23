export const SPLASH_RADIUS = 4;
export const LINGER_DURATION_TICKS = 600;

export function effectMultiplierAt(dist: number): number {
  if (dist > SPLASH_RADIUS) return 0;
  return 1 - dist / SPLASH_RADIUS;
}

export function affectsEntityAt(dist: number): boolean {
  return dist <= SPLASH_RADIUS;
}

export function lingerCloudDurationTicks(level: number): number {
  return LINGER_DURATION_TICKS + level * 100;
}
