export const SPREAD_RADIUS = 4;
export const MAX_NEIGHBORS_IN_AREA = 5;

export interface MushroomState {
  lightLevel: number;
  blockAboveSolid: boolean;
  nearbyMushroomsInArea: number;
  onMycelium: boolean;
}

export function canStay(s: MushroomState): boolean {
  if (s.onMycelium) return true;
  return s.lightLevel < 13;
}

export function canSpread(s: MushroomState, rng: () => number): boolean {
  if (s.lightLevel >= 13 && !s.onMycelium) return false;
  if (s.nearbyMushroomsInArea >= MAX_NEIGHBORS_IN_AREA) return false;
  return rng() < 1 / 25;
}

export function bonemealGrowsHugeMushroom(s: MushroomState, surfaceIsSuitable: boolean): boolean {
  return surfaceIsSuitable && !s.blockAboveSolid;
}
