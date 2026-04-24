export interface GridFeature {
  spacing: number;
  separation: number;
  salt: number;
}

function hashCoord(a: number, b: number, salt: number): number {
  let h = (a | 0) ^ ((b | 0) * 16777619);
  h = (h ^ salt) >>> 0;
  h = ((h ^ (h >>> 16)) * 2246822507) >>> 0;
  h = ((h ^ (h >>> 13)) * 3266489909) >>> 0;
  return (h ^ (h >>> 16)) >>> 0;
}

export function gridCellFor(
  chunkX: number,
  chunkZ: number,
  spacing: number,
): { gx: number; gz: number } {
  return { gx: Math.floor(chunkX / spacing), gz: Math.floor(chunkZ / spacing) };
}

export function isChosenChunk(
  chunkX: number,
  chunkZ: number,
  f: GridFeature,
  worldSeed: number,
): boolean {
  const { gx, gz } = gridCellFor(chunkX, chunkZ, f.spacing);
  const offsetX =
    gx * f.spacing + (hashCoord(gx, gz, worldSeed ^ f.salt) % (f.spacing - f.separation));
  const offsetZ =
    gz * f.spacing + (hashCoord(gx, gz + 9999, worldSeed ^ f.salt) % (f.spacing - f.separation));
  return chunkX === offsetX && chunkZ === offsetZ;
}
