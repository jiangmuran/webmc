import { describe, it, expect } from 'vitest';
import { combineOctaves, persistenceOctaves } from './noise_octaves_combine';

describe('noise octaves combine', () => {
  it('empty → zero', () => {
    expect(combineOctaves([], 0, 0, 0)).toBe(0);
  });

  it('normalized output', () => {
    const sample = (x: number) => Math.sin(x);
    const result = combineOctaves([{ amplitude: 1, frequency: 1, sample }], 1, 0, 0);
    expect(result).toBeCloseTo(Math.sin(1));
  });

  it('persistence reduces later octaves', () => {
    const sample = () => 1;
    const oct = persistenceOctaves(sample, 4, 0.5);
    expect(oct[0]?.amplitude).toBe(1);
    expect(oct[3]?.amplitude).toBeLessThan(oct[0]?.amplitude ?? Infinity);
  });

  it('frequency doubles per octave', () => {
    const oct = persistenceOctaves(() => 0, 4, 0.5);
    expect(oct[3]?.frequency).toBe(8);
  });

  it('fractal sum bounded', () => {
    const sample = () => 1;
    const octaves = persistenceOctaves(sample, 5, 0.5);
    const result = combineOctaves(octaves, 1, 0, 0);
    expect(result).toBeCloseTo(1);
  });
});
