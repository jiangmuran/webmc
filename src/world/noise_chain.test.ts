import { describe, it, expect } from 'vitest';
import { buildOctaves, maxAmplitudeSum, sampleFractal } from './noise_chain';

const cfg = {
  octaves: 4,
  baseFrequency: 0.01,
  lacunarity: 2,
  persistence: 0.5,
  seed: 1,
};

describe('noise chain', () => {
  it('builds octaves', () => {
    const o = buildOctaves(cfg);
    expect(o.length).toBe(4);
    expect(o[0]?.amplitude).toBe(1);
    expect(o[1]?.amplitude).toBe(0.5);
  });

  it('amplitude sum', () => {
    const o = buildOctaves(cfg);
    expect(maxAmplitudeSum(o)).toBeCloseTo(1.875);
  });

  it('sample in [-1, 1]', () => {
    const o = buildOctaves(cfg);
    const base = (x: number, y: number) => Math.sin(x + y);
    const v = sampleFractal(o, base, 10, 20);
    expect(v).toBeGreaterThanOrEqual(-1);
    expect(v).toBeLessThanOrEqual(1);
  });

  it('deterministic for same seed/coords', () => {
    const o = buildOctaves(cfg);
    const base = (x: number, y: number) => Math.sin(x * 3.14) * Math.cos(y * 1.57);
    expect(sampleFractal(o, base, 5, 7)).toBe(sampleFractal(o, base, 5, 7));
  });

  it('zero octaves = 0', () => {
    expect(sampleFractal([], () => 1, 0, 0)).toBe(0);
  });
});
