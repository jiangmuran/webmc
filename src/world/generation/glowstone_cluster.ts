export interface GlowstoneCluster {
  blockCount: number;
  sizeRadius: number;
}

export const MIN_BLOCKS = 3;
export const MAX_BLOCKS = 11;

export function rollCluster(rng: () => number): GlowstoneCluster {
  return {
    blockCount: MIN_BLOCKS + Math.floor(rng() * (MAX_BLOCKS - MIN_BLOCKS + 1)),
    sizeRadius: 1 + Math.floor(rng() * 3),
  };
}

export function attachesToCeilingOnly(): boolean {
  return true;
}

export function lightLevel(): number {
  return 15;
}
