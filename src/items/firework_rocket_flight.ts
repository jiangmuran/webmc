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

// Wiki (minecraft.wiki/w/Firework_Rocket): a starless firework deals
// 0 damage. With n ≥ 1 stars the center damage is 7 + 2 × (n - 1)
// and the radius is 5 blocks. Old `5 + stars*2` with radius 6 gave
// 5 damage at 0 stars (wiki: 0) and over-reached by 1 block.
// Sibling firework_damage.ts and firework_crafting.ts both use the
// wiki formula.
export function rocketDamageAt(r: Rocket, distance: number): number {
  if (distance > 5) return 0;
  if (r.starsCount <= 0) return 0;
  const base = 7 + (r.starsCount - 1) * 2;
  return Math.max(0, Math.floor(base * (1 - distance / 5)));
}

// Elytra forward boost from rocket: +1.5 blocks/tick toward look dir.
export const ELYTRA_BOOST_FORWARD = 1.5;
