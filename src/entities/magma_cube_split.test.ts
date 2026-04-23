import { describe, it, expect } from 'vitest';
import { splitSize, splitCount, onKill, maxHealth } from './magma_cube_split';

describe('magma cube split', () => {
  it('big splits to medium', () => {
    expect(splitSize(4)).toBe(2);
  });

  it('medium splits to small', () => {
    expect(splitSize(2)).toBe(1);
  });

  it('small no split', () => {
    expect(splitSize(1)).toBeUndefined();
  });

  it('count in 2-4 range', () => {
    const c = splitCount(4, () => 0.5);
    expect(c).toBeGreaterThanOrEqual(2);
    expect(c).toBeLessThanOrEqual(4);
  });

  it('small count 0', () => {
    expect(splitCount(1, () => 0.5)).toBe(0);
  });

  it('on kill emits children', () => {
    const r = onKill(2, () => 0);
    expect(r.newSize).toBe(1);
    expect(r.count).toBeGreaterThanOrEqual(2);
  });

  it('health grows with size squared', () => {
    expect(maxHealth(1)).toBe(1);
    expect(maxHealth(2)).toBe(4);
    expect(maxHealth(4)).toBe(16);
  });
});
