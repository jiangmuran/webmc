import { SECTOR_SIZE, REGION_CHUNKS } from './anvil_import_stub';

// Build an Anvil region (.mca) byte buffer from a per-chunk payload map.
//
// Layout (mirrors readChunkPayload):
//   sector 0: 4-byte chunk-table entries × 1024  (offset<<8 | sectorCount)
//   sector 1: 4-byte timestamp entries × 1024
//   sector 2..: payload sectors. Each chunk payload is:
//     uint32 BE  length (excluding this prefix), in bytes
//     uint8       compression type (1=gzip, 2=zlib, 3=none)
//     <length-1>  body bytes
//   payload is sector-padded with zeros.
//
// Source: minecraft.wiki "Region file format". Behavioral spec — clean-room.

export type CompressionType = 1 | 2 | 3;

export interface RegionWriteEntry {
  localX: number; // 0..31
  localZ: number; // 0..31
  body: Uint8Array; // already gzipped/deflated/raw per `compression`
  compression: CompressionType;
  timestamp?: number; // unix seconds; defaults to 0
}

export function writeRegion(entries: RegionWriteEntry[]): Uint8Array {
  // Compute per-chunk sector counts and total file sectors.
  const sectorCounts = new Uint8Array(REGION_CHUNKS); // each ≤ 255
  const offsets = new Uint16Array(REGION_CHUNKS); // start sector of each chunk
  let nextSector = 2;
  for (const e of entries) {
    if (e.localX < 0 || e.localX > 31 || e.localZ < 0 || e.localZ > 31) {
      throw new Error(`localX/Z out of range: (${String(e.localX)}, ${String(e.localZ)})`);
    }
    const idx = e.localX + e.localZ * 32;
    const totalLen = e.body.length + 5; // 4-byte length + 1-byte compression + body
    const sectors = Math.ceil(totalLen / SECTOR_SIZE);
    if (sectors > 255) throw new Error('chunk too large for Anvil region (>1MB)');
    sectorCounts[idx] = sectors;
    offsets[idx] = nextSector;
    nextSector += sectors;
  }
  const fileSize = nextSector * SECTOR_SIZE;
  const out = new Uint8Array(fileSize);
  const dv = new DataView(out.buffer);
  // Header.
  for (let i = 0; i < REGION_CHUNKS; i++) {
    const cnt = sectorCounts[i] ?? 0;
    if (cnt === 0) continue;
    const off = offsets[i] ?? 0;
    dv.setUint32(i * 4, ((off & 0xffffff) << 8) | (cnt & 0xff), false);
  }
  // Timestamps.
  for (const e of entries) {
    const idx = e.localX + e.localZ * 32;
    dv.setUint32(SECTOR_SIZE + idx * 4, Math.floor(e.timestamp ?? 0), false);
  }
  // Payloads.
  for (const e of entries) {
    const idx = e.localX + e.localZ * 32;
    const off = (offsets[idx] ?? 0) * SECTOR_SIZE;
    dv.setUint32(off, e.body.length + 1, false);
    out[off + 4] = e.compression;
    out.set(e.body, off + 5);
  }
  return out;
}
