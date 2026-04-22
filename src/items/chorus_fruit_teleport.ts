// Chorus fruit: eating teleports the player up to 8 blocks in a random
// direction, requires a safe (non-solid) landing spot.

export interface TeleportAttempt {
  trialX: number;
  trialY: number;
  trialZ: number;
  safe: boolean;
}

export const CHORUS_MAX_DISTANCE = 8;
export const CHORUS_MAX_ATTEMPTS = 16;

export function pickTrial(
  origin: { x: number; y: number; z: number },
  rand: () => number,
): { x: number; y: number; z: number } {
  const dx = (rand() - 0.5) * 2 * CHORUS_MAX_DISTANCE;
  const dy = (rand() - 0.5) * 2 * CHORUS_MAX_DISTANCE;
  const dz = (rand() - 0.5) * 2 * CHORUS_MAX_DISTANCE;
  return { x: origin.x + dx, y: origin.y + dy, z: origin.z + dz };
}

export function firstSafe(attempts: TeleportAttempt[]): TeleportAttempt | null {
  for (const a of attempts) if (a.safe) return a;
  return null;
}

// Eating deals 2.5s cooldown and 4 hunger gain.
export const CHORUS_COOLDOWN_TICKS = 20;
export const CHORUS_HUNGER_RESTORE = 4;
export const CHORUS_SATURATION = 2.4;
