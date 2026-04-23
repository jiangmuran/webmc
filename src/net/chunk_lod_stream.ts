export interface ChunkRequest {
  cx: number;
  cz: number;
  distance: number;
}

export function streamingOrder(
  requests: readonly ChunkRequest[],
  maxPerTick: number,
): readonly ChunkRequest[] {
  return [...requests].sort((a, b) => a.distance - b.distance).slice(0, maxPerTick);
}

export function lodLevelForDistance(d: number): 'full' | 'half' | 'quarter' | 'skip' {
  if (d < 4) return 'full';
  if (d < 8) return 'half';
  if (d < 16) return 'quarter';
  return 'skip';
}

export function downsampleFactor(lod: 'full' | 'half' | 'quarter' | 'skip'): number {
  if (lod === 'full') return 1;
  if (lod === 'half') return 2;
  if (lod === 'quarter') return 4;
  return 0;
}
