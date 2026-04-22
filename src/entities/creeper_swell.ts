// Creeper swell. When a player is within 3 blocks, a creeper's fuse
// builds up (1.5 s at normal, 0.75 s if charged by lightning). If the
// player leaves range, the fuse reverses.

export interface CreeperState {
  swellTicks: number; // 0..maxSwell
  charged: boolean;
}

export const SWELL_NORMAL_TICKS = 30;
export const SWELL_CHARGED_TICKS = 15;
export const IGNITE_RANGE = 3.0;

export function maxSwell(c: CreeperState): number {
  return c.charged ? SWELL_CHARGED_TICKS : SWELL_NORMAL_TICKS;
}

export interface TickResult {
  exploded: boolean;
}

export function tickSwell(c: CreeperState, distanceToPlayer: number): TickResult {
  if (distanceToPlayer <= IGNITE_RANGE) {
    c.swellTicks = Math.min(maxSwell(c), c.swellTicks + 1);
    if (c.swellTicks >= maxSwell(c)) return { exploded: true };
  } else {
    c.swellTicks = Math.max(0, c.swellTicks - 1);
  }
  return { exploded: false };
}

// Explosion power: normal 3.0, charged 6.0.
export const POWER_NORMAL = 3;
export const POWER_CHARGED = 6;

export function explosionPower(c: CreeperState): number {
  return c.charged ? POWER_CHARGED : POWER_NORMAL;
}

// Flint-and-steel forces ignite regardless of range.
export function forceIgnite(c: CreeperState): void {
  c.swellTicks = maxSwell(c);
}
