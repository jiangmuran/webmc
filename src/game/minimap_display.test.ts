import { describe, it, expect } from 'vitest';
import { chunksToSample, defaultMinimap, inView, rotatePoint } from './minimap_display';

describe('minimap', () => {
  it('default visible', () => {
    expect(defaultMinimap().visible).toBe(true);
  });

  it('chunks to sample covers area', () => {
    const cs = chunksToSample(0, 0, 2);
    expect(cs.length).toBe(25);
  });

  it('inView square respects extent', () => {
    const cfg = defaultMinimap();
    expect(inView({ playerCx: 0, playerCz: 0, targetCx: 2, targetCz: 2, config: cfg })).toBe(true);
    expect(inView({ playerCx: 0, playerCz: 0, targetCx: 10, targetCz: 10, config: cfg })).toBe(
      false,
    );
  });

  it('inView circle respects radius', () => {
    const cfg = { ...defaultMinimap(), shape: 'circle' as const };
    expect(inView({ playerCx: 0, playerCz: 0, targetCx: 2, targetCz: 2, config: cfg })).toBe(true);
    expect(inView({ playerCx: 0, playerCz: 0, targetCx: 10, targetCz: 10, config: cfg })).toBe(
      false,
    );
  });

  it('rotate by π swaps axes', () => {
    const r = rotatePoint(1, 0, Math.PI);
    expect(r.x).toBeCloseTo(-1);
    expect(r.z).toBeCloseTo(0);
  });
});
