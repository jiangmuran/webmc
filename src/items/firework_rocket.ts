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

// Crossbow / elytra boost require a firework rocket.
export function boostDuration(rocket: RocketItem): number {
  return rocket.flightDuration * 1.5;
}
