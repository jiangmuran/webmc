import { describe, it, expect } from 'vitest';
import {
  encodeChunk,
  chooseCodec,
  estimateSavings,
  writeBudgetBytesPerSecond,
} from './chunk_save_compression';

describe('chunk save compression', () => {
  it('encode tags codec', () => {
    const e = encodeChunk(new Uint8Array([1, 2, 3]), 'zstd');
    expect(e.header.codec).toBe('zstd');
    expect(e.body.length).toBe(3);
  });

  it('choose codec', () => {
    expect(chooseCodec(true)).toBe('zstd');
    expect(chooseCodec(false)).toBe('deflate');
  });

  it('savings estimates', () => {
    expect(estimateSavings('zstd', 1000)).toBeGreaterThan(estimateSavings('deflate', 1000));
    expect(estimateSavings('raw', 1000)).toBe(0);
  });

  it('write budget', () => {
    expect(writeBudgetBytesPerSecond(60, 1000, 30)).toBe(2000);
  });
});
