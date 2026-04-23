export const ACTIVATION_RADIUS = 16;
export const SPAWN_DELAY_MIN = 200;
export const SPAWN_DELAY_MAX = 800;
export const MAX_NEARBY_ENTITIES = 6;

export function isActive(playerDistance: number): boolean {
  return playerDistance <= ACTIVATION_RADIUS;
}

export function rollNextDelay(rng: () => number): number {
  return SPAWN_DELAY_MIN + Math.floor(rng() * (SPAWN_DELAY_MAX - SPAWN_DELAY_MIN));
}

export function atMobCap(nearby: number): boolean {
  return nearby >= MAX_NEARBY_ENTITIES;
}
