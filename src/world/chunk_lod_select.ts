// Chunk LOD selection. At render distance, far chunks use coarser
// meshes / billboards. Tier boundaries are radius-based.

export type LodTier = 'full' | 'medium' | 'coarse' | 'billboard';

export const LOD_FULL_MAX = 4;
export const LOD_MEDIUM_MAX = 8;
export const LOD_COARSE_MAX = 16;

export function tierForDistance(chunkRadius: number): LodTier {
  if (chunkRadius < LOD_FULL_MAX) return 'full';
  if (chunkRadius < LOD_MEDIUM_MAX) return 'medium';
  if (chunkRadius < LOD_COARSE_MAX) return 'coarse';
  return 'billboard';
}

export function meshDetailScale(t: LodTier): number {
  if (t === 'full') return 1;
  if (t === 'medium') return 0.5;
  if (t === 'coarse') return 0.25;
  return 0.1;
}

export function renderInterval(t: LodTier): number {
  if (t === 'full') return 1;
  if (t === 'medium') return 2;
  if (t === 'coarse') return 4;
  return 8;
}
