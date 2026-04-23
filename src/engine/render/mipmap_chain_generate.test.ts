import { describe, it, expect } from 'vitest';
import { chainLevels, bytesForRGBA, totalBytes } from './mipmap_chain_generate';

describe('mipmap chain generate', () => {
  it('halves each step', () => {
    const levels = chainLevels(256, 256);
    expect(levels[0]?.width).toBe(256);
    expect(levels[1]?.width).toBe(128);
    expect(levels[levels.length - 1]).toEqual({ width: 1, height: 1 });
  });

  it('16x16 base → 5 levels', () => {
    expect(chainLevels(16, 16)).toHaveLength(5);
  });

  it('bytes grow', () => {
    expect(bytesForRGBA({ width: 32, height: 32 })).toBeGreaterThan(
      bytesForRGBA({ width: 1, height: 1 }),
    );
  });

  it('total ~ 4/3 base', () => {
    const total = totalBytes(16, 16);
    expect(total).toBeGreaterThan(16 * 16 * 4);
  });
});
