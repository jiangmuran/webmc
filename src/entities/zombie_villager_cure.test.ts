import { describe, it, expect } from 'vitest';
import {
  startCure,
  addBedOrBars,
  remainingTicks,
  isCured,
  BASE_CURE_TICKS,
} from './zombie_villager_cure';

describe('zombie cure', () => {
  it('base duration', () => {
    const s = startCure(0);
    expect(remainingTicks(s, 0)).toBe(BASE_CURE_TICKS);
    expect(isCured(s, BASE_CURE_TICKS)).toBe(true);
  });

  it('beds/bars speed up', () => {
    const s = startCure(0);
    addBedOrBars(s, 5);
    expect(remainingTicks(s, 0)).toBeLessThan(BASE_CURE_TICKS);
  });

  it('clamped min duration', () => {
    const s = startCure(0);
    addBedOrBars(s, 100);
    expect(remainingTicks(s, 0)).toBeGreaterThan(0);
  });
});
