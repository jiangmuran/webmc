export type Dimension = 'overworld' | 'nether';

export const NETHER_RATIO = 8;

export function toNether(overworld: { x: number; y: number; z: number }): {
  x: number;
  y: number;
  z: number;
} {
  return {
    x: Math.floor(overworld.x / NETHER_RATIO),
    y: overworld.y,
    z: Math.floor(overworld.z / NETHER_RATIO),
  };
}

export function toOverworld(nether: { x: number; y: number; z: number }): {
  x: number;
  y: number;
  z: number;
} {
  return {
    x: nether.x * NETHER_RATIO,
    y: nether.y,
    z: nether.z * NETHER_RATIO,
  };
}

export function searchRadiusBlocks(dim: Dimension): number {
  return dim === 'nether' ? 16 : 128;
}
