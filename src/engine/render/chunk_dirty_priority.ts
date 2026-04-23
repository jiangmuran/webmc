export interface DirtyChunk {
  dx: number;
  dz: number;
  lastDirtyTick: number;
}

export function priority(c: DirtyChunk, nowTick: number): number {
  const distance2 = c.dx * c.dx + c.dz * c.dz;
  const age = Math.max(0, nowTick - c.lastDirtyTick);
  return age * 100 - distance2;
}

export function nextToRemesh(chunks: DirtyChunk[], nowTick: number): DirtyChunk | undefined {
  if (chunks.length === 0) return undefined;
  return [...chunks].sort((a, b) => priority(b, nowTick) - priority(a, nowTick))[0];
}
