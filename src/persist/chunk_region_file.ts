export const REGION_SIZE = 32;
export const CHUNKS_PER_REGION = REGION_SIZE * REGION_SIZE;

export function regionCoord(chunkX: number, chunkZ: number): { rx: number; rz: number } {
  return {
    rx: Math.floor(chunkX / REGION_SIZE),
    rz: Math.floor(chunkZ / REGION_SIZE),
  };
}

export function regionFileName(rx: number, rz: number): string {
  return `r.${rx.toString()}.${rz.toString()}.mca`;
}

export function localOffset(chunkX: number, chunkZ: number): { lx: number; lz: number } {
  return {
    lx: ((chunkX % REGION_SIZE) + REGION_SIZE) % REGION_SIZE,
    lz: ((chunkZ % REGION_SIZE) + REGION_SIZE) % REGION_SIZE,
  };
}
