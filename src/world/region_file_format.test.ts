import { describe, it, expect } from 'vitest';
import {
  chunkLocalIndex,
  regionFor,
  encodeLocation,
  decodeLocation,
  sectorSpan,
  REGION_SIZE,
  SECTOR_SIZE,
} from './region_file_format';

describe('region format', () => {
  it('local index bounds', () => {
    expect(chunkLocalIndex(0, 0)).toBe(0);
    expect(chunkLocalIndex(REGION_SIZE - 1, REGION_SIZE - 1)).toBe(REGION_SIZE * REGION_SIZE - 1);
  });

  it('negative cx', () => {
    expect(chunkLocalIndex(-1, 0)).toBe(REGION_SIZE - 1);
  });

  it('regionFor floor', () => {
    expect(regionFor(33, -1)).toEqual({ rx: 1, rz: -1 });
  });

  it('encode/decode round-trip', () => {
    const u = encodeLocation(12345, 7);
    expect(decodeLocation(u)).toEqual({ sectorOffset: 12345, sectorCount: 7 });
  });

  it('sectorSpan', () => {
    expect(sectorSpan(1)).toBe(1);
    expect(sectorSpan(SECTOR_SIZE - 5)).toBe(1);
    expect(sectorSpan(SECTOR_SIZE)).toBe(2);
  });
});
