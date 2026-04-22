// Firework rocket flight duration. The number of gunpowder determines
// how many 0.5s "boost segments" the rocket provides when used on a
// player gliding with elytra (or when launched from a dispenser). A
// rocket with stars detonates at the end of its flight.

export const MAX_FLIGHT_DURATION = 3;

export interface CraftFireworkQuery {
  gunpowder: number; // 1..3
  paper: number;
  stars: number; // 0..7
}

export interface CraftFireworkResult {
  success: boolean;
  flightDuration: 1 | 2 | 3;
  starCount: number;
}

export function craftFirework(q: CraftFireworkQuery): CraftFireworkResult {
  if (q.paper < 1 || q.gunpowder < 1) {
    return { success: false, flightDuration: 1, starCount: 0 };
  }
  const duration = Math.min(MAX_FLIGHT_DURATION, Math.max(1, q.gunpowder)) as 1 | 2 | 3;
  const stars = Math.min(7, Math.max(0, q.stars));
  return { success: true, flightDuration: duration, starCount: stars };
}

// When flying with elytra, a rocket of flightDuration=N adds N × 0.5s
// of boost. Without stars, no self-damage; with stars, self-damage per
// elytra_firework_boost.ts applies.
export function boostSeconds(flightDuration: 1 | 2 | 3): number {
  return flightDuration * 0.5 + 0.5;
}

// A rocket fired from a crossbow flies in a straight line; its duration
// also determines detonation distance.
export function crossbowDistance(flightDuration: 1 | 2 | 3): number {
  // roughly 20 blocks per flightDuration unit when fired from a bow.
  return flightDuration * 20;
}

// Fired from a dispenser: auto-launches upward; detonation still happens
// at end of flight.
export const DISPENSER_LAUNCH_SPEED = 1.0;
