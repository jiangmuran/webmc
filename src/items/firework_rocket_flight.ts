// Firework rocket flight simulation. Used standalone (explodes mid-air)
// or to boost elytra. Flight duration = 10 + dur*10 + rand(0..6) ticks.

export interface Rocket {
  flightDuration: 1 | 2 | 3;
  ageTicks: number;
  maxAgeTicks: number;
  starsCount: number;
}

export function launchRocket(
  flightDuration: 1 | 2 | 3,
  rand: () => number,
  starsCount = 0,
): Rocket {
  const maxAge = 10 + flightDuration * 10 + Math.floor(rand() * 6);
  return { flightDuration, ageTicks: 0, maxAgeTicks: maxAge, starsCount };
}

export interface TickResult {
  exploded: boolean;
}

export function tickRocket(r: Rocket): TickResult {
  r.ageTicks += 1;
  return { exploded: r.ageTicks >= r.maxAgeTicks };
}

// Explosion damage at distance. Scales with stars; falls off to 5.
export function rocketDamageAt(r: Rocket, distance: number): number {
  if (distance > 6) return 0;
  const base = 5 + r.starsCount * 2;
  return Math.max(0, Math.floor(base * (1 - distance / 6)));
}

// Elytra forward boost from rocket: +1.5 blocks/tick toward look dir.
export const ELYTRA_BOOST_FORWARD = 1.5;
