// Sun + moon rendering positions. Both orbit the player along a horizon
// arc; the moon's texture cycles through 8 phases each lunar night.

export type Vec3 = readonly [number, number, number];

const SUN_DISTANCE = 100;
const MOON_DISTANCE = 100;

// Convert normalized time (0 dawn, 0.25 noon, 0.5 dusk, 0.75 midnight)
// into an angle on a great circle inclined toward the horizon.
function sunAngleRad(normalizedTime: number): number {
  return (((normalizedTime % 1) + 1) % 1) * Math.PI * 2;
}

export function sunPosition(normalizedTime: number): Vec3 {
  const a = sunAngleRad(normalizedTime);
  return [Math.cos(a) * SUN_DISTANCE, Math.sin(a) * SUN_DISTANCE, 0];
}

// Moon is opposite the sun (offset by π).
export function moonPosition(normalizedTime: number): Vec3 {
  const a = sunAngleRad(normalizedTime) + Math.PI;
  return [Math.cos(a) * MOON_DISTANCE, Math.sin(a) * MOON_DISTANCE, 0];
}

// Phase 0..7 → different moon-face textures.
export function moonPhaseIndex(dayNumber: number): number {
  return ((dayNumber % 8) + 8) % 8;
}

// Sun/moon visual size: sun is larger, moon is dimmer at new-phase.
export const SUN_SIZE_UNITS = 30;
export const MOON_SIZE_UNITS = 20;

export function moonBrightness(phase: number): number {
  // New moon (phase 4) is dark; full (phase 0) is bright.
  const p = ((phase % 8) + 8) % 8;
  const distToFull = Math.min(p, 8 - p);
  return 1 - distToFull / 4;
}
