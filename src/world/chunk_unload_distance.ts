export interface ChunkDistanceInput {
  chunkX: number;
  chunkZ: number;
  playerChunkX: number;
  playerChunkZ: number;
  viewDistance: number;
}

export function chunkDistance(i: ChunkDistanceInput): number {
  return Math.max(Math.abs(i.chunkX - i.playerChunkX), Math.abs(i.chunkZ - i.playerChunkZ));
}

export function shouldUnload(i: ChunkDistanceInput, unloadMargin = 2): boolean {
  return chunkDistance(i) > i.viewDistance + unloadMargin;
}

export function shouldKeepLoaded(i: ChunkDistanceInput): boolean {
  return chunkDistance(i) <= i.viewDistance;
}

export function chunksInViewDistance(viewDistance: number): number {
  const side = viewDistance * 2 + 1;
  return side * side;
}
