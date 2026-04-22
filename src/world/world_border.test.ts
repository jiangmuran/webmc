import { describe, it, expect } from 'vitest';
import { checkPosition, makeWorldBorder, setSize, tickWorldBorder } from './world_border';

describe('world border', () => {
  it('inside = no damage', () => {
    const b = makeWorldBorder(100);
    const r = checkPosition(b, 10, 10);
    expect(r.insideBorder).toBe(true);
    expect(r.damagePerSec).toBe(0);
  });

  it('far outside = damage scales with distance', () => {
    const b = makeWorldBorder(100);
    const r = checkPosition(b, 200, 0);
    expect(r.insideBorder).toBe(false);
    expect(r.damagePerSec).toBeGreaterThan(0);
  });

  it('interpolates size over time', () => {
    const b = makeWorldBorder(100);
    setSize(b, 200, 10);
    tickWorldBorder(b, 5);
    expect(b.diameter).toBeGreaterThan(100);
    expect(b.diameter).toBeLessThan(200);
  });

  it('finishes interpolation at target', () => {
    const b = makeWorldBorder(100);
    setSize(b, 200, 10);
    tickWorldBorder(b, 20);
    expect(b.diameter).toBe(200);
  });

  it('instant size change with overSec=0', () => {
    const b = makeWorldBorder(100);
    setSize(b, 50, 0);
    expect(b.diameter).toBe(50);
  });
});
