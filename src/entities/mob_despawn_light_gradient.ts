export interface Mob {
  type: string;
  skyLight: number;
  blockLight: number;
  ticksAlive: number;
}

export const MIN_LIGHT_NATURAL_SPAWN = 7;

export function shouldDespawnFromLight(m: Mob): boolean {
  if (['zombie', 'skeleton', 'creeper', 'spider'].includes(m.type)) {
    return m.skyLight >= 12 && m.blockLight <= 0;
  }
  return false;
}

export function canNaturallyRespawn(m: Mob): boolean {
  return m.blockLight === 0 && m.skyLight < MIN_LIGHT_NATURAL_SPAWN;
}
