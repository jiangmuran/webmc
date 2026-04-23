// Anvil region import. Parses the MCA header + per-chunk offsets
// enough to iterate chunks; delegates NBT decoding to caller.
// (Full Anvil NBT parse is TBD; this is a structural scaffold.)

export const REGION_WIDTH = 32;
export const REGION_CHUNKS = REGION_WIDTH * REGION_WIDTH;
export const SECTOR_SIZE = 4096;

export interface McaHeader {
  offsets: Uint32Array; // 1024 entries, sector offset << 8 | sector count
  timestamps: Uint32Array;
}

export function parseHeader(bytes: Uint8Array): McaHeader {
  if (bytes.length < SECTOR_SIZE * 2) {
    throw new Error('region file too small');
  }
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const offsets = new Uint32Array(REGION_CHUNKS);
  const timestamps = new Uint32Array(REGION_CHUNKS);
  for (let i = 0; i < REGION_CHUNKS; i++) {
    offsets[i] = dv.getUint32(i * 4);
    timestamps[i] = dv.getUint32(SECTOR_SIZE + i * 4);
  }
  return { offsets, timestamps };
}

export function chunkLocation(
  h: McaHeader,
  localX: number,
  localZ: number,
): { sector: number; count: number } | null {
  const idx = (localX & 31) + (localZ & 31) * 32;
  const raw = h.offsets[idx];
  if (raw === undefined || raw === 0) return null;
  return { sector: raw >>> 8, count: raw & 0xff };
}

export const IMPORT_DISCLAIMER =
  'User uploads Anvil files at their own licensing risk. webmc never ships Mojang-copyrighted data.';
