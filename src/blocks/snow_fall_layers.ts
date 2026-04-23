export interface Ctx {
  biomeSnowing: boolean;
  topOfChunk: boolean;
  layers: number;
}

export const MAX_LAYERS = 8;

export function addLayer(c: Ctx): Ctx {
  if (!c.biomeSnowing || !c.topOfChunk) return c;
  return { ...c, layers: Math.min(MAX_LAYERS, c.layers + 1) };
}

export function heightBlocks(c: Ctx): number {
  return c.layers / MAX_LAYERS;
}

export function placesFullBlockAt(c: Ctx): boolean {
  return c.layers >= MAX_LAYERS;
}
