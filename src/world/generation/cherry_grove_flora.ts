export interface FloraCtx {
  isCherryBiome: boolean;
  rng: () => number;
}

export function cherryPetalRate(c: FloraCtx): number {
  return c.isCherryBiome ? 0.1 : 0;
}

export function shouldPlaceTorchflower(c: FloraCtx): boolean {
  return c.isCherryBiome && c.rng() < 0.04;
}

export function leafColor(): [number, number, number] {
  return [248, 196, 214];
}
