// Farmland trample. Entities landing on farmland from > 0.5 blocks
// have a chance to trample it back to dirt; crops drop as items.

export interface FarmlandQuery {
  entityMass: number; // kg
  fallDistance: number; // blocks
  rand: () => number;
}

export const TRAMPLE_MIN_FALL = 0.5;
export const TRAMPLE_CHANCE_MIN_MASS = 10;

export function willTrample(q: FarmlandQuery): boolean {
  if (q.fallDistance <= TRAMPLE_MIN_FALL) return false;
  if (q.entityMass < TRAMPLE_CHANCE_MIN_MASS) {
    // small entities only trample with falls > 1 block
    return q.fallDistance > 1 && q.rand() < 0.33;
  }
  return q.rand() < 0.66;
}

// Hydration state: moisture 0..7 decays if no water within 4 blocks.
export const MOISTURE_MAX = 7;
export const WATER_RADIUS = 4;

export interface MoistureQuery {
  currentMoisture: number;
  waterWithinRadius: boolean;
  rand: () => number;
}

export function updateMoisture(q: MoistureQuery): number {
  if (q.waterWithinRadius) return MOISTURE_MAX;
  if (q.currentMoisture === 0) return 0;
  if (q.rand() < 0.25) return q.currentMoisture - 1;
  return q.currentMoisture;
}
