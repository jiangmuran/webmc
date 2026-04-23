import { describe, it, expect } from 'vitest';
import { bandFor, yInBand, veinSizeRoll, DEFAULT_BANDS } from './ore_vein_scatter';

describe('ore vein scatter', () => {
  it('diamond yMax ≤ 16', () => {
    expect(bandFor('diamond').yMax).toBeLessThanOrEqual(16);
  });

  it('coal most veins', () => {
    const maxV = Math.max(...DEFAULT_BANDS.map((b) => b.veinsPerChunk));
    expect(bandFor('coal').veinsPerChunk).toBe(maxV);
  });

  it('yInBand edges', () => {
    const b = bandFor('diamond');
    expect(yInBand(b, b.yMin)).toBe(true);
    expect(yInBand(b, b.yMax + 1)).toBe(false);
  });

  it('vein size in range', () => {
    const b = bandFor('iron');
    for (let i = 0; i < 20; i++) {
      const n = veinSizeRoll(b, Math.random);
      expect(n).toBeGreaterThanOrEqual(b.veinSizeMin);
      expect(n).toBeLessThanOrEqual(b.veinSizeMax);
    }
  });

  it('unknown throws', () => {
    expect(() => bandFor('unobtanium' as 'coal')).toThrow();
  });
});
