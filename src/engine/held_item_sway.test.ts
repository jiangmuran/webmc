import { describe, it, expect } from 'vitest';
import { onMouseDelta, settle, reset, SWAY_MAX } from './held_item_sway';

describe('held item sway', () => {
  it('reset zero', () => {
    expect(reset()).toEqual({ x: 0, y: 0 });
  });

  it('mouse shifts sway', () => {
    const s = onMouseDelta(reset(), 100, 50);
    expect(s.x).toBeLessThan(0);
    expect(s.y).toBeGreaterThan(0);
  });

  it('sway clamps at max', () => {
    const s = onMouseDelta(reset(), 1e6, 0);
    expect(s.x).toBeGreaterThanOrEqual(-SWAY_MAX);
  });

  it('settle decays toward zero', () => {
    let s = { x: 0.3, y: 0.3 };
    for (let i = 0; i < 100; i++) s = settle(s);
    expect(s.x).toBeCloseTo(0);
    expect(s.y).toBeCloseTo(0);
  });
});
