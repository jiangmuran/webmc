// Firework rocket crafting. 1 paper + 1-3 gunpowder → rocket with
// flight duration 1/2/3. Firework stars (0-7) add to its detonation.

import type { FireworkStar } from './firework_star';

export interface RocketItem {
  flightDuration: 1 | 2 | 3;
  stars: readonly FireworkStar[];
}

export interface RocketCraftQuery {
  paperCount: number;
  gunpowderCount: 1 | 2 | 3;
  stars: readonly FireworkStar[];
}

export function craftFireworkRocket(q: RocketCraftQuery): RocketItem | null {
  if (q.paperCount < 1) return null;
  if (q.stars.length > 7) return null;
  return { flightDuration: q.gunpowderCount, stars: [...q.stars] };
}

// Crossbow / elytra boost. Wiki (minecraft.wiki/w/Firework_Rocket):
// "A firework rocket flies for `(10 + 10 × flight_duration)` ticks
// before exploding," giving 1 / 1.5 / 2 seconds at flight 1 / 2 / 3.
// On an elytra the boost lasts as long as the rocket flies.
//
// Old `flight × 1.5` returned 1.5 / 3 / 4.5 sec — about 2× the wiki
// boost time, sending players much further than canon. Sibling
// elytra_firework_boost.ts already uses `0.5 + 0.5 × flight`.
export function boostDuration(rocket: RocketItem): number {
  return 0.5 + 0.5 * rocket.flightDuration;
}
