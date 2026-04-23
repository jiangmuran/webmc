export interface RavineParams {
  chunkX: number;
  chunkZ: number;
  rng: () => number;
}

export function shouldStartInChunk(p: RavineParams): boolean {
  return p.rng() < 1 / 50;
}

export function ravineDepth(p: RavineParams): number {
  const min = 8;
  const max = 48;
  return min + Math.floor(p.rng() * (max - min));
}

export function ravineLength(p: RavineParams): number {
  return 112 + Math.floor(p.rng() * 100);
}

export function ravineWidthAt(t: number, length: number, peakWidth: number): number {
  const phase = t / length;
  return peakWidth * Math.sin(phase * Math.PI);
}
