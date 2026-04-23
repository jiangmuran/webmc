import { describe, it, expect } from 'vitest';
import {
  parseHeader,
  chunkLocation,
  SECTOR_SIZE,
  REGION_CHUNKS,
  IMPORT_DISCLAIMER,
} from './anvil_import_stub';

function makeEmptyRegion(): Uint8Array {
  return new Uint8Array(SECTOR_SIZE * 2);
}

describe('anvil import stub', () => {
  it('rejects short files', () => {
    expect(() => parseHeader(new Uint8Array(10))).toThrow();
  });

  it('empty region all zero offsets', () => {
    const h = parseHeader(makeEmptyRegion());
    expect(h.offsets.length).toBe(REGION_CHUNKS);
    for (let i = 0; i < REGION_CHUNKS; i++) expect(h.offsets[i]).toBe(0);
  });

  it('chunkLocation null for unpopulated', () => {
    const h = parseHeader(makeEmptyRegion());
    expect(chunkLocation(h, 0, 0)).toBeNull();
  });

  it('chunkLocation decodes sector + count', () => {
    const bytes = makeEmptyRegion();
    const dv = new DataView(bytes.buffer);
    dv.setUint32(0, (2 << 8) | 3); // chunk (0,0): sector=2, count=3
    const h = parseHeader(bytes);
    expect(chunkLocation(h, 0, 0)).toEqual({ sector: 2, count: 3 });
  });

  it('includes import disclaimer', () => {
    expect(IMPORT_DISCLAIMER).toContain('Mojang');
  });
});
