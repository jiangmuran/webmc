import { describe, it, expect } from 'vitest';
import { rollYInRange, inBand, ORE_PARAMS } from './ore_vein_3d';

describe('ore vein 3d', () => {
  it('diamond shallow in negative Y', () => {
    expect(inBand(-50, 'diamond')).toBe(true);
    expect(inBand(100, 'diamond')).toBe(false);
  });

  it('emerald high up', () => {
    expect(inBand(200, 'emerald')).toBe(true);
  });

  it('y rolls in range', () => {
    const p = ORE_PARAMS['coal'];
    if (!p) throw new Error('coal missing');
    for (let i = 0; i < 20; i++) {
      const y = rollYInRange(() => Math.random(), p);
      expect(y).toBeGreaterThanOrEqual(p.yMin);
      expect(y).toBeLessThanOrEqual(p.yMax);
    }
  });

  it('unknown ore no band', () => {
    expect(inBand(0, 'diamondium')).toBe(false);
  });
});
