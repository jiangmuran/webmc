import { describe, it, expect } from 'vitest';
import { probabilityAt, profileFor } from './ore_gen_curve';

describe('ore curves', () => {
  it('out of range = 0', () => {
    expect(probabilityAt('diamond', 100)).toBe(0);
    expect(probabilityAt('emerald', -64)).toBe(0);
  });

  it('peak yields base prob', () => {
    const p = profileFor('iron');
    expect(probabilityAt('iron', p.peakY)).toBeCloseTo(p.baseProb);
  });

  it('triangular drop-off', () => {
    const p = profileFor('coal');
    const atPeak = probabilityAt('coal', p.peakY);
    const awayLeft = probabilityAt('coal', (p.minY + p.peakY) / 2);
    expect(awayLeft).toBeLessThan(atPeak);
    expect(awayLeft).toBeGreaterThan(0);
  });

  it('monotone below peak', () => {
    const p = profileFor('iron');
    let prev = 0;
    for (let y = p.minY; y <= p.peakY; y++) {
      const v = probabilityAt('iron', y);
      expect(v).toBeGreaterThanOrEqual(prev);
      prev = v;
    }
  });
});
