export const ELYTRA_SPEED_PER_TICK = 0.33;

export function elytraFireworkAccel(lookVector: { x: number; y: number; z: number }): {
  dvx: number;
  dvy: number;
  dvz: number;
} {
  const len = Math.hypot(lookVector.x, lookVector.y, lookVector.z) || 1;
  return {
    dvx: (lookVector.x / len) * ELYTRA_SPEED_PER_TICK,
    dvy: (lookVector.y / len) * ELYTRA_SPEED_PER_TICK,
    dvz: (lookVector.z / len) * ELYTRA_SPEED_PER_TICK,
  };
}

export function flightDurationTicks(flightDuration: 1 | 2 | 3): number {
  return (flightDuration + 1) * 10 + Math.floor(Math.random() * 6 * 0);
}
