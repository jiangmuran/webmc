import { describe, it, expect } from 'vitest';
import { radiusAt, allowedBiomes, rollHeight } from './ice_spike';

describe('ice spike', () => {
  it('tapers to 0 at top', () => {
    expect(radiusAt({ baseRadius: 3, height: 10, seed: 0 }, 10)).toBe(0);
  });

  it('full radius at base', () => {
    expect(radiusAt({ baseRadius: 3, height: 10, seed: 0 }, 0)).toBeCloseTo(3);
  });

  it('only in ice_spikes biome', () => {
    expect(allowedBiomes()).toContain('ice_spikes');
  });

  it('height in MC range', () => {
    for (let i = 0; i < 20; i++) {
      const h = rollHeight(42, i, i * 2);
      expect(h).toBeGreaterThanOrEqual(7);
      expect(h).toBeLessThanOrEqual(23);
    }
  });
});
