// webmc region file layout. A region covers 32x32 chunks. Header has
// two 4KB sectors: 4-byte offset + length per chunk + 4-byte timestamp.
// Chunks are zstd-compressed and aligned to 4KB sectors.

export const REGION_SIZE = 32;
export const SECTOR_SIZE = 4096;
export const HEADER_SECTORS = 2; // offsets + timestamps
export const CHUNK_HEADER_BYTES = REGION_SIZE * REGION_SIZE * 4;

export function chunkLocalIndex(cx: number, cz: number): number {
  const lx = ((cx % REGION_SIZE) + REGION_SIZE) % REGION_SIZE;
  const lz = ((cz % REGION_SIZE) + REGION_SIZE) % REGION_SIZE;
  return lz * REGION_SIZE + lx;
}

export function regionFor(cx: number, cz: number): { rx: number; rz: number } {
  return { rx: Math.floor(cx / REGION_SIZE), rz: Math.floor(cz / REGION_SIZE) };
}

export interface RegionHeaderEntry {
  sectorOffset: number;
  sectorCount: number;
  timestampMs: number;
}

export function encodeLocation(sectorOffset: number, sectorCount: number): number {
  return (sectorOffset << 8) | (sectorCount & 0xff);
}

export function decodeLocation(u32: number): { sectorOffset: number; sectorCount: number } {
  return { sectorOffset: u32 >>> 8, sectorCount: u32 & 0xff };
}

export function sectorSpan(byteLength: number): number {
  return Math.ceil((byteLength + 5) / SECTOR_SIZE); // 4-byte size + 1-byte compression tag
}
