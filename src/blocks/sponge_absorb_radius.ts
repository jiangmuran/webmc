export const ABSORB_RADIUS = 7;
export const MAX_WATER_BLOCKS = 65;

export function absorbsNearby(distance: number): boolean {
  return distance <= ABSORB_RADIUS;
}

export function becomesWetAfterAbsorb(): boolean {
  return true;
}

export function maxAbsorbed(): number {
  return MAX_WATER_BLOCKS;
}
