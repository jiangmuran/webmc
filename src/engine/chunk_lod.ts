// Chunk LOD (level-of-detail) selector. Picks a mesh resolution tier for
// each chunk based on its squared distance from the camera. Tiers:
//   0 = full 1×1×1 voxels
//   1 = 2× downsampled (majority voxel per 2³ cell)
//   2 = 4× downsampled
//   3 = 8× downsampled (skyline horizon)
//   -1 = cull (outside view distance)

export type LodTier = -1 | 0 | 1 | 2 | 3;

export interface LodSettings {
  viewDistance: number; // chunks
  highDetailRadius: number; // chunks
  mediumDetailRadius: number;
  lowDetailRadius: number;
}

export function defaultLodSettings(viewDistance: number): LodSettings {
  return {
    viewDistance,
    highDetailRadius: Math.min(3, viewDistance),
    mediumDetailRadius: Math.min(6, viewDistance),
    lowDetailRadius: Math.min(10, viewDistance),
  };
}

// Chebyshev (chunk-grid) distance is used because chunks are square in
// XZ and LOD boundaries look natural on a grid.
export function lodForChunk(
  chunkCx: number,
  chunkCz: number,
  cameraCx: number,
  cameraCz: number,
  s: LodSettings,
): LodTier {
  const dx = Math.abs(chunkCx - cameraCx);
  const dz = Math.abs(chunkCz - cameraCz);
  const d = Math.max(dx, dz);
  if (d > s.viewDistance) return -1;
  if (d <= s.highDetailRadius) return 0;
  if (d <= s.mediumDetailRadius) return 1;
  if (d <= s.lowDetailRadius) return 2;
  return 3;
}

// Returns the subsample factor for a given tier (1, 2, 4, 8).
export function subsampleFactor(tier: LodTier): number {
  if (tier <= 0) return 1;
  return 1 << tier; // 2, 4, 8
}

// Estimates the vertex count saved when switching from full to tier.
export function tierVertexFraction(tier: LodTier): number {
  if (tier <= 0) return 1;
  const f = subsampleFactor(tier);
  return 1 / (f * f); // XZ cross-section scales with factor²
}
