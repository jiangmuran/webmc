import { describe, it, expect } from 'vitest';
import { valueNoise2D, fbm2D } from './value_noise_2d';

describe('value noise 2d', () => {
  it('in [0,1]', () => {
    for (let i = 0; i < 50; i++) {
      const v = valueNoise2D(1, i * 0.1, i * 0.3);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it('deterministic', () => {
    expect(valueNoise2D(42, 1.2, 3.4)).toBe(valueNoise2D(42, 1.2, 3.4));
  });

  it('different seeds differ', () => {
    expect(valueNoise2D(1, 1, 1)).not.toBe(valueNoise2D(2, 1, 1));
  });

  it('fbm in [0,1]', () => {
    const v = fbm2D(5, 1, 2, 4, 0.5);
    expect(v).toBeGreaterThanOrEqual(0);
    expect(v).toBeLessThanOrEqual(1);
  });

  it('fbm smoother than single octave', () => {
    const a = Math.abs(valueNoise2D(9, 0, 0) - valueNoise2D(9, 0.01, 0));
    const b = Math.abs(fbm2D(9, 0, 0) - fbm2D(9, 0.01, 0));
    expect(b).toBeLessThanOrEqual(a + 0.1);
  });
});
