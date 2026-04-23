export interface DarkOak {
  trunkHeight: number;
  trunkSize: 2;
  foliageLayers: number;
}

export const MIN_HEIGHT = 6;
export const MAX_HEIGHT = 9;

export function rollDarkOak(rng: () => number): DarkOak {
  return {
    trunkHeight: MIN_HEIGHT + Math.floor(rng() * (MAX_HEIGHT - MIN_HEIGHT + 1)),
    trunkSize: 2,
    foliageLayers: 3,
  };
}

export function trunkBlockCount(t: DarkOak): number {
  return t.trunkHeight * t.trunkSize * t.trunkSize;
}

export function requiresDarkForestBiome(biome: string): boolean {
  return biome === 'dark_forest' || biome === 'dark_forest_hills';
}
