import { describe, it, expect } from 'vitest';
import { proposedTarget, hurtsOnFall, SEARCH_RADIUS } from './chorus_fruit_teleport_target';

describe('chorus fruit teleport target', () => {
  it('target near origin', () => {
    const t = proposedTarget({ originX: 0, originY: 64, originZ: 0, rng: () => 0.5 });
    expect(Math.abs(t.x)).toBeLessThanOrEqual(SEARCH_RADIUS);
  });

  it('Y never negative', () => {
    const t = proposedTarget({ originX: 0, originY: 0, originZ: 0, rng: () => 0 });
    expect(t.y).toBeGreaterThanOrEqual(0);
  });

  it('no fall damage', () => {
    expect(hurtsOnFall()).toBe(false);
  });
});
