export function hash32(a: number, b: number): number {
  let h = (a * 0x1f1f1f1f) ^ b;
  h = (h ^ (h >>> 16)) * 0x85ebca6b;
  h = (h ^ (h >>> 13)) * 0xc2b2ae35;
  return (h ^ (h >>> 16)) >>> 0;
}

export function isSlimeChunk(worldSeed: number, chunkX: number, chunkZ: number): boolean {
  const mixed = hash32(chunkX | 0, chunkZ | 0) ^ (worldSeed | 0);
  return mixed % 10 === 0;
}
