import { describe, it, expect } from 'vitest';
import {
  regionCoord,
  regionFileName,
  localOffset,
  REGION_SIZE,
  CHUNKS_PER_REGION,
} from './chunk_region_file';

describe('chunk region file', () => {
  it('chunk 0,0 in r 0,0', () => {
    expect(regionCoord(0, 0)).toEqual({ rx: 0, rz: 0 });
  });

  it('chunk 40 in r 1', () => {
    expect(regionCoord(40, 0).rx).toBe(1);
  });

  it('file name format', () => {
    expect(regionFileName(2, -3)).toBe('r.2.-3.mca');
  });

  it('local offset wraps', () => {
    expect(localOffset(-1, -1)).toEqual({ lx: REGION_SIZE - 1, lz: REGION_SIZE - 1 });
  });

  it('1024 chunks per region', () => {
    expect(CHUNKS_PER_REGION).toBe(1024);
  });
});
