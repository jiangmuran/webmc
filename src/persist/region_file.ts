// Region file format. A region is 32×32 chunks stored in a single flat
// file. Header is 4KB (1024 × 4-byte chunk table: offset + length in
// 4KB sectors) + 4KB timestamp table + N × payload sectors. Each payload
// starts with a 5-byte length + compression type prefix.

export const REGION_SIZE = 32;
export const SECTOR_BYTES = 4096;
export const HEADER_SECTORS = 2; // offset table + timestamp table

export type Compression = 'gzip' | 'zlib' | 'uncompressed' | 'lz4';

export interface ChunkEntry {
  offsetSectors: number; // offset within the file, in sectors
  sectorCount: number; // length in sectors
  timestamp: number; // last-modified seconds
  compression: Compression;
  payload: Uint8Array;
}

// Region key: (regionX, regionZ). A chunk's region is chunkX >> 5, chunkZ >> 5.
export interface RegionKey {
  rx: number;
  rz: number;
}

export function chunkToRegion(cx: number, cz: number): RegionKey {
  return { rx: cx >> 5, rz: cz >> 5 };
}

export function localChunkIndex(cx: number, cz: number): number {
  const lx = ((cx % REGION_SIZE) + REGION_SIZE) % REGION_SIZE;
  const lz = ((cz % REGION_SIZE) + REGION_SIZE) % REGION_SIZE;
  return lz * REGION_SIZE + lx;
}

// In-memory region representation. Mirrors the on-disk layout but keeps
// payloads as Uint8Arrays instead of packed sectors; packing happens on
// serialization.
export class Region {
  private readonly entries = new Map<number, ChunkEntry>();
  readonly key: RegionKey;

  constructor(key: RegionKey) {
    this.key = key;
  }

  set(cx: number, cz: number, entry: ChunkEntry): void {
    this.entries.set(localChunkIndex(cx, cz), entry);
  }

  get(cx: number, cz: number): ChunkEntry | null {
    return this.entries.get(localChunkIndex(cx, cz)) ?? null;
  }

  has(cx: number, cz: number): boolean {
    return this.entries.has(localChunkIndex(cx, cz));
  }

  remove(cx: number, cz: number): boolean {
    return this.entries.delete(localChunkIndex(cx, cz));
  }

  chunkCount(): number {
    return this.entries.size;
  }

  // Estimate on-disk size in bytes.
  estimatedBytes(): number {
    let sectors = HEADER_SECTORS;
    for (const e of this.entries.values()) {
      sectors += e.sectorCount;
    }
    return sectors * SECTOR_BYTES;
  }
}

// Compute sectors needed for a payload (including the 5-byte length prefix).
export function payloadSectors(payloadBytes: number): number {
  return Math.ceil((payloadBytes + 5) / SECTOR_BYTES);
}
