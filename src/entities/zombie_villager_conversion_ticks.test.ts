import { describe, it, expect } from 'vitest';
import {
  startCure,
  tick,
  cured,
  CURE_MIN_TICKS,
  CURE_MAX_TICKS,
} from './zombie_villager_conversion_ticks';

describe('zombie villager conversion ticks', () => {
  it('starts within range', () => {
    const p = startCure(Math.random);
    expect(p.ticksRemaining).toBeGreaterThanOrEqual(CURE_MIN_TICKS);
    expect(p.ticksRemaining).toBeLessThanOrEqual(CURE_MAX_TICKS);
  });

  it('tick decrements', () => {
    const p = { ticksRemaining: 100, inLight: true, nearbyBedsOrBars: 0 };
    expect(tick(p).ticksRemaining).toBe(99);
  });

  it('dark + beds double', () => {
    const p = { ticksRemaining: 100, inLight: false, nearbyBedsOrBars: 3 };
    expect(tick(p).ticksRemaining).toBe(98);
  });

  it('cured threshold', () => {
    expect(cured({ ticksRemaining: 0, inLight: false, nearbyBedsOrBars: 0 })).toBe(true);
  });
});
