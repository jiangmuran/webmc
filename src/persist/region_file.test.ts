import { describe, it, expect } from 'vitest';
import {
  chunkToRegion,
  localChunkIndex,
  payloadSectors,
  Region,
  REGION_SIZE,
  SECTOR_BYTES,
  type ChunkEntry,
} from './region_file';

function mockEntry(): ChunkEntry {
  return {
    offsetSectors: 2,
    sectorCount: 1,
    timestamp: 1000,
    compression: 'zlib',
    payload: new Uint8Array(100),
  };
}

describe('region file', () => {
  it('chunk → region mapping', () => {
    expect(chunkToRegion(0, 0)).toEqual({ rx: 0, rz: 0 });
    expect(chunkToRegion(32, 0)).toEqual({ rx: 1, rz: 0 });
    expect(chunkToRegion(-1, -1)).toEqual({ rx: -1, rz: -1 });
  });

  it('local index unique within region', () => {
    const seen = new Set<number>();
    for (let cx = 0; cx < REGION_SIZE; cx++) {
      for (let cz = 0; cz < REGION_SIZE; cz++) {
        seen.add(localChunkIndex(cx, cz));
      }
    }
    expect(seen.size).toBe(REGION_SIZE * REGION_SIZE);
  });

  it('set/get round-trips', () => {
    const r = new Region({ rx: 0, rz: 0 });
    const e = mockEntry();
    r.set(5, 10, e);
    expect(r.get(5, 10)).toBe(e);
    expect(r.has(5, 10)).toBe(true);
  });

  it('remove deletes', () => {
    const r = new Region({ rx: 0, rz: 0 });
    r.set(5, 10, mockEntry());
    r.remove(5, 10);
    expect(r.has(5, 10)).toBe(false);
  });

  it('payloadSectors accounts for prefix', () => {
    expect(payloadSectors(1)).toBe(1);
    expect(payloadSectors(SECTOR_BYTES)).toBe(2);
  });

  it('estimated bytes includes header', () => {
    const r = new Region({ rx: 0, rz: 0 });
    r.set(0, 0, mockEntry());
    expect(r.estimatedBytes()).toBeGreaterThan(SECTOR_BYTES);
  });
});
