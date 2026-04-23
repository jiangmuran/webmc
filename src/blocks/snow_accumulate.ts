// Snow layers accumulate during snowfall (cold biome + rain weather).
// Stack up to 8 layers; shoveling removes one layer.

export interface SnowLayer {
  layers: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
}

export const MAX_LAYERS = 8;

export function accumulateStep(s: SnowLayer, snowing: boolean, rand: () => number): SnowLayer {
  if (!snowing) return s;
  if (s.layers >= MAX_LAYERS) return s;
  if (rand() > 0.1) return s;
  return { layers: (s.layers + 1) as SnowLayer['layers'] };
}

export function shovel(s: SnowLayer): SnowLayer | null {
  if (s.layers <= 1) return null; // removed
  return { layers: (s.layers - 1) as SnowLayer['layers'] };
}

export function heightBlocks(s: SnowLayer): number {
  return s.layers / 8;
}

export function entitySinks(s: SnowLayer): boolean {
  return s.layers >= 2;
}
