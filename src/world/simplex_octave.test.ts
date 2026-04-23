import { describe, it, expect } from 'vitest';
import { octaveNoise } from './simplex_octave';

describe('simplex octave noise', () => {
  it('single octave passes through', () => {
    const r = octaveNoise(() => 0.5, { octaves: 1, lacunarity: 2, gain: 0.5, baseFrequency: 1 }, 0, 0);
    expect(r).toBeCloseTo(0.5);
  });

  it('no octaves zero', () => {
    expect(
      octaveNoise(() => 1, { octaves: 0, lacunarity: 2, gain: 0.5, baseFrequency: 1 }, 0, 0),
    ).toBe(0);
  });

  it('normalized to base range', () => {
    const r = octaveNoise(
      () => 1,
      { octaves: 4, lacunarity: 2, gain: 0.5, baseFrequency: 1 },
      0,
      0,
    );
    expect(r).toBeCloseTo(1);
  });

  it('higher frequency changes value', () => {
    const rFn = (x: number) => Math.sin(x);
    const a = octaveNoise(rFn, {
      octaves: 1,
      lacunarity: 2,
      gain: 0.5,
      baseFrequency: 0.1,
    }, 10, 0);
    const b = octaveNoise(rFn, {
      octaves: 1,
      lacunarity: 2,
      gain: 0.5,
      baseFrequency: 1,
    }, 10, 0);
    expect(a).not.toBeCloseTo(b);
  });
});
