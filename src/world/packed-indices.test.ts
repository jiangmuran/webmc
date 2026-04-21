import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  type BitsPerIndex,
  allocIndices,
  bitsNeeded,
  readIndex,
  repack,
  wordsNeeded,
  writeIndex,
} from './packed-indices';

describe('bitsNeeded', () => {
  it('collapses to 0 for 0 or 1 palette entries', () => {
    expect(bitsNeeded(0)).toBe(0);
    expect(bitsNeeded(1)).toBe(0);
  });
  it('picks 4 bits for ≤16 entries', () => {
    expect(bitsNeeded(2)).toBe(4);
    expect(bitsNeeded(16)).toBe(4);
  });
  it('picks 8 bits for ≤256 entries', () => {
    expect(bitsNeeded(17)).toBe(8);
    expect(bitsNeeded(256)).toBe(8);
  });
  it('picks 16 bits for larger', () => {
    expect(bitsNeeded(257)).toBe(16);
    expect(bitsNeeded(65536)).toBe(16);
  });
});

describe('wordsNeeded', () => {
  it('0 bits needs 0 words', () => {
    expect(wordsNeeded(4096, 0)).toBe(0);
  });
  it('4 bits over 4096 blocks fits 512 words', () => {
    expect(wordsNeeded(4096, 4)).toBe(512);
  });
  it('8 bits over 4096 blocks fits 1024 words', () => {
    expect(wordsNeeded(4096, 8)).toBe(1024);
  });
  it('16 bits over 4096 blocks fits 2048 words', () => {
    expect(wordsNeeded(4096, 16)).toBe(2048);
  });
});

describe('read/write round-trip', () => {
  function roundtrip(bits: BitsPerIndex, count: number): void {
    const max = bits === 0 ? 0 : (1 << bits) - 1;
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 0, max }), { minLength: count, maxLength: count }),
        (values) => {
          const arr = allocIndices(count, bits);
          if (bits === 0) {
            expect(arr).toBeNull();
            return;
          }
          if (arr === null) throw new Error('alloc returned null for non-zero bits');
          for (let i = 0; i < count; i++) writeIndex(arr, i, bits, values[i] ?? 0);
          for (let i = 0; i < count; i++) expect(readIndex(arr, i, bits)).toBe(values[i]);
        },
      ),
      { numRuns: 50 },
    );
  }

  it('4-bit packing over 128 slots', () => {
    roundtrip(4, 128);
  });
  it('8-bit packing over 128 slots', () => {
    roundtrip(8, 128);
  });
  it('16-bit packing over 128 slots', () => {
    roundtrip(16, 128);
  });
  it('0-bit always reads 0 regardless of write', () => {
    const arr = allocIndices(100, 0);
    expect(arr).toBeNull();
    expect(readIndex(arr, 50, 0)).toBe(0);
  });
});

describe('repack preserves values across bit widths', () => {
  it('repacks 4→8 losslessly', () => {
    const count = 64;
    const src = allocIndices(count, 4);
    if (src === null) throw new Error();
    for (let i = 0; i < count; i++) writeIndex(src, i, 4, i & 0xf);
    const dst = repack(src, count, 4, 8);
    if (dst === null) throw new Error();
    for (let i = 0; i < count; i++) expect(readIndex(dst, i, 8)).toBe(i & 0xf);
  });

  it('repacks 8→16 losslessly', () => {
    const count = 64;
    const src = allocIndices(count, 8);
    if (src === null) throw new Error();
    for (let i = 0; i < count; i++) writeIndex(src, i, 8, i & 0xff);
    const dst = repack(src, count, 8, 16);
    if (dst === null) throw new Error();
    for (let i = 0; i < count; i++) expect(readIndex(dst, i, 16)).toBe(i & 0xff);
  });

  it('repacks 0→4 fills zeros and preserves array length', () => {
    const count = 100;
    const dst = repack(null, count, 0, 4);
    if (dst === null) throw new Error();
    for (let i = 0; i < count; i++) expect(readIndex(dst, i, 4)).toBe(0);
  });

  it('repack to 0 yields null regardless of source', () => {
    const src = allocIndices(32, 4);
    expect(repack(src, 32, 4, 0)).toBeNull();
  });
});
