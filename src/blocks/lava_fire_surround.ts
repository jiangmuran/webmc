// Lava igniting nearby flammables. Checks a small box around lava
// source; flammable blocks roll to ignite adjacent air.

export interface LavaIgniteCtx {
  withinRange: boolean;
  flammableEncouragement: number;
  adjacentAir: boolean;
  rand: () => number;
}

export const LAVA_FIRE_RADIUS = 2;

export function tryIgnite(c: LavaIgniteCtx): boolean {
  if (!c.withinRange || !c.adjacentAir) return false;
  const chance = c.flammableEncouragement / 100;
  return c.rand() < chance;
}

export function inRange(distance: number): boolean {
  return distance <= LAVA_FIRE_RADIUS;
}

// Rain suppresses lava ignition chance.
export function rainSuppresses(): boolean {
  return true;
}
