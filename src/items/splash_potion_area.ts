// Splash potion throw + impact area. Effect falls off with distance
// from impact center up to 4-block radius.
//
// Wiki (minecraft.wiki/w/Splash_Potion#Effect): "the duration decreases
// linearly on the same scale (rounded to the nearest 1/20 second),
// with no effect being applied if the duration would be 1 second or
// less."
//
// So below 20 ticks (1 second) the splash applies nothing — not just
// a tiny duration. Old appliedDurationTicks let durations of 1–19
// ticks slip through, which would visually flash the buff for less
// than a second instead of cleanly skipping.

export const SPLASH_RADIUS = 4;
export const MIN_DURATION_TICKS = 20;

export interface SplashTarget {
  distance: number;
}

export function intensityScale(distance: number): number {
  if (distance >= SPLASH_RADIUS) return 0;
  return 1 - distance / SPLASH_RADIUS;
}

export function appliedDurationTicks(sourceDurationTicks: number, distance: number): number {
  const scaled = Math.floor(sourceDurationTicks * intensityScale(distance));
  return scaled <= MIN_DURATION_TICKS ? 0 : scaled;
}

export function hasAnyEffect(distance: number): boolean {
  return distance < SPLASH_RADIUS;
}

export function directHitFullEffect(): number {
  return 1;
}
