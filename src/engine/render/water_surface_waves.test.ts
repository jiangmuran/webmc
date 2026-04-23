import { describe, it, expect } from 'vitest';
import { surfaceOffset, flowUV, WAVE_AMPLITUDE } from './water_surface_waves';

describe('water surface waves', () => {
  it('bounded amplitude', () => {
    for (let t = 0; t < 10; t += 0.5) {
      const o = surfaceOffset(5, 3, t);
      expect(Math.abs(o)).toBeLessThanOrEqual(WAVE_AMPLITUDE + 1e-9);
    }
  });

  it('UV advances', () => {
    const a = flowUV(0, 0, 0);
    const b = flowUV(0, 0, 1);
    expect(b.u).toBeGreaterThan(a.u);
    expect(b.v).toBeGreaterThan(a.v);
  });

  it('same time same offset', () => {
    expect(surfaceOffset(2, 2, 1)).toBe(surfaceOffset(2, 2, 1));
  });

  it('different xyz different wave', () => {
    expect(surfaceOffset(0, 0, 1)).not.toBe(surfaceOffset(3, 4, 1));
  });
});
