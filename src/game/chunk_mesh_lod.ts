// Chunk mesh LOD (level-of-detail). Close chunks full-res; mid
// coalesces 2x2 blocks; far 4x4. Hard cap LOD3 (8x8) to prevent
// artifacts at extreme distance.

export type LodLevel = 0 | 1 | 2 | 3;

export const LOD_RADII_CHUNKS: Record<LodLevel, number> = {
  0: 4,
  1: 8,
  2: 16,
  3: 32,
};

export function lodForDistance(chunkDistance: number): LodLevel {
  if (chunkDistance <= LOD_RADII_CHUNKS[0]) return 0;
  if (chunkDistance <= LOD_RADII_CHUNKS[1]) return 1;
  if (chunkDistance <= LOD_RADII_CHUNKS[2]) return 2;
  return 3;
}

export function lodCoalesceBlocks(lod: LodLevel): number {
  return 1 << lod;
}

export function meshTriangleFactor(lod: LodLevel): number {
  // Each step halves triangle count per axis; across a 2D face it's 1/4.
  const coalesce = lodCoalesceBlocks(lod);
  return 1 / (coalesce * coalesce);
}

// Hysteresis: require 2 chunk-distance buffer before switching LOD to
// avoid churn at the border.
export const HYSTERESIS = 2;

export function lodWithHysteresis(currentLod: LodLevel, chunkDistance: number): LodLevel {
  const target = lodForDistance(chunkDistance);
  if (target === currentLod) return currentLod;
  const borders = LOD_RADII_CHUNKS;
  if (target < currentLod) {
    // upgrading to higher detail; require clearance margin
    if (chunkDistance < borders[target] - HYSTERESIS) return target;
    return currentLod;
  }
  // downgrading; require well past
  if (chunkDistance > borders[currentLod] + HYSTERESIS) return target;
  return currentLod;
}
