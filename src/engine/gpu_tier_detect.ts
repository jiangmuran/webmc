// GPU tier detection heuristic. Inspects renderer string + max texture
// size + limits to classify the device into low/mid/high tiers.

export interface GpuInfo {
  rendererName: string;
  maxTextureSize: number;
  webgpuAvailable: boolean;
  instancedArrays: boolean;
}

export type GpuTier = 'low' | 'mid' | 'high';

const HIGH_KEYWORDS = ['RTX', 'RX 6', 'RX 7', 'Apple M', 'A17', 'A18', 'Adreno 7'];
const MID_KEYWORDS = ['GTX', 'Apple A1', 'Adreno 6', 'Mali-G7', 'Mali-G8'];

export function classify(g: GpuInfo): GpuTier {
  const name = g.rendererName;
  if (g.webgpuAvailable && HIGH_KEYWORDS.some((k) => name.includes(k))) return 'high';
  if (MID_KEYWORDS.some((k) => name.includes(k))) return 'mid';
  if (g.maxTextureSize >= 8192) return 'mid';
  return 'low';
}

export function recommendedChunkRadius(t: GpuTier, desktop: boolean): number {
  if (desktop) return t === 'high' ? 16 : t === 'mid' ? 12 : 8;
  return t === 'high' ? 8 : t === 'mid' ? 6 : 4;
}
