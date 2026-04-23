// Splash potion throw + impact area. Effect falls off with distance
// from impact center up to 4-block radius.

export const SPLASH_RADIUS = 4;

export interface SplashTarget {
  distance: number;
}

export function intensityScale(distance: number): number {
  if (distance >= SPLASH_RADIUS) return 0;
  return 1 - distance / SPLASH_RADIUS;
}

export function appliedDurationTicks(sourceDurationTicks: number, distance: number): number {
  return Math.floor(sourceDurationTicks * intensityScale(distance));
}

export function hasAnyEffect(distance: number): boolean {
  return distance < SPLASH_RADIUS;
}

export function directHitFullEffect(): number {
  return 1;
}
