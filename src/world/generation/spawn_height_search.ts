export interface HeightQuery {
  chunkX: number;
  chunkZ: number;
  bottomY: number;
  topY: number;
  isSolid: (y: number) => boolean;
  isSafeAbove: (y: number) => boolean;
}

export function findTopSolid(q: HeightQuery): number | undefined {
  for (let y = q.topY; y >= q.bottomY; y--) {
    if (q.isSolid(y)) return y;
  }
  return undefined;
}

export function findSpawnSurface(q: HeightQuery): number | undefined {
  const top = findTopSolid(q);
  if (top === undefined) return undefined;
  if (!q.isSafeAbove(top + 1) || !q.isSafeAbove(top + 2)) return undefined;
  return top + 1;
}
