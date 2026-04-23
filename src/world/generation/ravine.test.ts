import { describe, it, expect } from 'vitest';
import { shouldStartInChunk, ravineDepth, ravineLength, ravineWidthAt } from './ravine';

describe('ravine generation', () => {
  it('rare start', () => {
    expect(shouldStartInChunk({ chunkX: 0, chunkZ: 0, rng: () => 0.001 })).toBe(true);
    expect(shouldStartInChunk({ chunkX: 0, chunkZ: 0, rng: () => 0.5 })).toBe(false);
  });

  it('depth within bounds', () => {
    const d = ravineDepth({ chunkX: 0, chunkZ: 0, rng: () => 0.5 });
    expect(d).toBeGreaterThanOrEqual(8);
    expect(d).toBeLessThan(48);
  });

  it('length range', () => {
    const l = ravineLength({ chunkX: 0, chunkZ: 0, rng: () => 0.5 });
    expect(l).toBeGreaterThanOrEqual(112);
    expect(l).toBeLessThanOrEqual(212);
  });

  it('width zero at ends', () => {
    expect(ravineWidthAt(0, 100, 5)).toBeCloseTo(0);
    expect(ravineWidthAt(100, 100, 5)).toBeCloseTo(0);
  });

  it('width peak at middle', () => {
    expect(ravineWidthAt(50, 100, 5)).toBeCloseTo(5);
  });
});
