export interface SpringParams {
  liquid: 'water' | 'lava';
  yMin: number;
  yMax: number;
  count: number;
}

export const DEFAULT_WATER_SPRING: SpringParams = {
  liquid: 'water',
  yMin: -62,
  yMax: 192,
  count: 25,
};

export const DEFAULT_LAVA_SPRING: SpringParams = {
  liquid: 'lava',
  yMin: -63,
  yMax: 64,
  count: 10,
};

export function canPlaceAt(y: number, p: SpringParams, hasSolidNeighbors: boolean): boolean {
  if (y < p.yMin || y > p.yMax) return false;
  return hasSolidNeighbors;
}
