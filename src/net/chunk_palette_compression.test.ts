import { describe, it, expect } from 'vitest';
import { bitsPerIndex, packedBytes, singleValueOptimization } from './chunk_palette_compression';

describe('chunk palette compression', () => {
  it('0 bits when single entry', () => {
    expect(bitsPerIndex(1)).toBe(0);
  });

  it('min 4 bits for small palettes', () => {
    expect(bitsPerIndex(2)).toBe(4);
    expect(bitsPerIndex(16)).toBe(4);
  });

  it('grows with palette size', () => {
    expect(bitsPerIndex(17)).toBeGreaterThan(4);
    expect(bitsPerIndex(33)).toBe(6);
  });

  it('packed bytes rounds up', () => {
    expect(packedBytes(4096, 4)).toBe(2048);
    expect(packedBytes(10, 4)).toBe(5);
  });

  it('single value optimization flag', () => {
    expect(singleValueOptimization(1)).toBe(true);
    expect(singleValueOptimization(2)).toBe(false);
  });
});
