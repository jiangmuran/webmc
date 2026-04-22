import { describe, it, expect } from 'vitest';
import { compressChunk, decompressChunk, ratio, registerCodec } from './chunk_compress';

describe('chunk compression', () => {
  it('identity codec round-trips', () => {
    const src = new Uint8Array([1, 2, 3, 4, 5]);
    const blob = compressChunk(src, 'none');
    const back = decompressChunk(blob);
    expect(Array.from(back)).toEqual([1, 2, 3, 4, 5]);
  });

  it('zstd round-trips (placeholder RLE)', () => {
    const src = new Uint8Array([0, 0, 0, 1, 1, 0]);
    const blob = compressChunk(src, 'zstd');
    expect(Array.from(decompressChunk(blob))).toEqual([0, 0, 0, 1, 1, 0]);
  });

  it('repeated data compresses smaller', () => {
    const src = new Uint8Array(200).fill(7);
    const blob = compressChunk(src, 'zstd');
    expect(ratio(src.length, blob)).toBeLessThan(0.1);
  });

  it('registerCodec swaps impl', () => {
    registerCodec('none', {
      compress: (b) => Uint8Array.from(b).reverse(),
      decompress: (b) => Uint8Array.from(b).reverse(),
    });
    const blob = compressChunk(new Uint8Array([1, 2, 3]), 'none');
    expect(Array.from(decompressChunk(blob))).toEqual([1, 2, 3]);
    // restore identity for other tests
    registerCodec('none', { compress: (b) => b, decompress: (b) => b });
  });

  it('ratio returns 1 for empty', () => {
    expect(ratio(0, { codec: 'none', payload: new Uint8Array(0) })).toBe(1);
  });
});
