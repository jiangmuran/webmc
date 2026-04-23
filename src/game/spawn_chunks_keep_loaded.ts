export const SPAWN_CHUNK_RADIUS = 8;

export interface ChunkCoord {
  x: number;
  z: number;
}

export function isSpawnChunk(c: ChunkCoord, spawn: ChunkCoord): boolean {
  return (
    Math.abs(c.x - spawn.x) <= SPAWN_CHUNK_RADIUS && Math.abs(c.z - spawn.z) <= SPAWN_CHUNK_RADIUS
  );
}

export function alwaysLoadedChunks(spawn: ChunkCoord): readonly ChunkCoord[] {
  const out: ChunkCoord[] = [];
  for (let dx = -SPAWN_CHUNK_RADIUS; dx <= SPAWN_CHUNK_RADIUS; dx++) {
    for (let dz = -SPAWN_CHUNK_RADIUS; dz <= SPAWN_CHUNK_RADIUS; dz++) {
      out.push({ x: spawn.x + dx, z: spawn.z + dz });
    }
  }
  return out;
}

export function totalSpawnChunks(): number {
  const side = SPAWN_CHUNK_RADIUS * 2 + 1;
  return side * side;
}
