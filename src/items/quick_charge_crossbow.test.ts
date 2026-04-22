import { describe, it, expect } from 'vitest';
import { drawTicks, drawSeconds, BASE_DRAW_TICKS } from './quick_charge_crossbow';

describe('quick charge crossbow', () => {
  it('base draw at level 0', () => {
    expect(drawTicks(0)).toBe(BASE_DRAW_TICKS);
  });

  it('level reduces', () => {
    expect(drawTicks(3)).toBeLessThan(drawTicks(0));
  });

  it('minimum 5 ticks', () => {
    expect(drawTicks(100)).toBe(5);
  });

  it('seconds = ticks/20', () => {
    expect(drawSeconds(3)).toBeCloseTo(drawTicks(3) / 20);
  });
});
