// Creeper swell. When a player is within 3 blocks, a creeper's fuse
// builds up (1.5 s at normal, 0.75 s if charged by lightning). If the
// player leaves the cancel range, the fuse reverses.
//
// Wiki (minecraft.wiki/w/Creeper): "When within 3 blocks of a player,
// a creeper stops moving, hisses, flashes and expands, and explodes
// after 1.5 seconds (30 ticks) … the distance that the player must
// move in order for a creeper to cancel its explosion is 7 blocks,
// regardless of difficulty."
//
// Old code conflated the two thresholds at IGNITE_RANGE = 3.0 — a
// player who triggered swell at 2.5 blocks could cancel it by
// stepping to 3.5 blocks (vs wiki, which requires moving past 7).
// Now: ignite at ≤3, sustain swell while ≤7, cancel only beyond 7.

export interface CreeperState {
  swellTicks: number; // 0..maxSwell
  charged: boolean;
}

export const SWELL_NORMAL_TICKS = 30;
export const SWELL_CHARGED_TICKS = 15;
export const IGNITE_RANGE = 3.0;
export const CANCEL_RANGE = 7.0;

export function maxSwell(c: CreeperState): number {
  return c.charged ? SWELL_CHARGED_TICKS : SWELL_NORMAL_TICKS;
}

export interface TickResult {
  exploded: boolean;
}

export function tickSwell(c: CreeperState, distanceToPlayer: number): TickResult {
  // Already swelling? Sustain unless past cancel range.
  if (c.swellTicks > 0) {
    if (distanceToPlayer > CANCEL_RANGE) {
      c.swellTicks = Math.max(0, c.swellTicks - 1);
      return { exploded: false };
    }
    c.swellTicks = Math.min(maxSwell(c), c.swellTicks + 1);
    if (c.swellTicks >= maxSwell(c)) return { exploded: true };
    return { exploded: false };
  }
  // Not yet swelling: only ignite if within 3 blocks.
  if (distanceToPlayer <= IGNITE_RANGE) {
    c.swellTicks = 1;
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
