export interface ChunkInfo {
  key: string;
  dx: number;
  dz: number;
  lastAccessedTick: number;
  dirty: boolean;
}

export function score(c: ChunkInfo, nowTick: number): number {
  const distance = c.dx * c.dx + c.dz * c.dz;
  const age = nowTick - c.lastAccessedTick;
  const dirtyPenalty = c.dirty ? -1_000_000 : 0;
  return distance + age + dirtyPenalty;
}

export function pickEvictionCandidates(
  chunks: ChunkInfo[],
  nowTick: number,
  count: number,
): ChunkInfo[] {
  const sorted = [...chunks].sort((a, b) => score(b, nowTick) - score(a, nowTick));
  return sorted.slice(0, count);
}
