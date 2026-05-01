import { describe, it, expect } from 'vitest';
import { drawTicks, drawSeconds, BASE_DRAW_TICKS } from './quick_charge_crossbow';

describe('quick charge crossbow', () => {
  it('base draw at level 0', () => {
    expect(drawTicks(0)).toBe(BASE_DRAW_TICKS);
  });

  it('level reduces', () => {
    expect(drawTicks(3)).toBeLessThan(drawTicks(0));
  });

  it('Quick Charge V → 0 ticks (wiki: instant)', () => {
    // Wiki (minecraft.wiki/w/Quick_Charge): at level V the crossbow
    // charges instantly (25 - 5*5 = 0 ticks). Level capped at V so
    // higher requests clamp to the same value.
    expect(drawTicks(5)).toBe(0);
    expect(drawTicks(100)).toBe(0);
  });

  it('seconds = ticks/20', () => {
    expect(drawSeconds(3)).toBeCloseTo(drawTicks(3) / 20);
  });
});
