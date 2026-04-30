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

  it('14 accelerants → 4.2% extra (wiki)', () => {
    const p = { ticksRemaining: 100, inLight: false, nearbyBedsOrBars: 14 };
    // Each tick now removes 1 + 14×0.003 = 1.042 ticks.
    expect(tick(p).ticksRemaining).toBeCloseTo(100 - 1.042, 5);
  });

  it('beyond 14 accelerants does not stack (wiki: capped)', () => {
    const p = { ticksRemaining: 100, inLight: false, nearbyBedsOrBars: 100 };
    expect(tick(p).ticksRemaining).toBeCloseTo(100 - 1.042, 5);
  });

  it('light has no effect (wiki: not a factor)', () => {
    const dark = tick({ ticksRemaining: 100, inLight: false, nearbyBedsOrBars: 14 });
    const lit = tick({ ticksRemaining: 100, inLight: true, nearbyBedsOrBars: 14 });
    expect(dark.ticksRemaining).toBe(lit.ticksRemaining);
  });

  it('cured threshold', () => {
    expect(cured({ ticksRemaining: 0, inLight: false, nearbyBedsOrBars: 0 })).toBe(true);
  });
});
