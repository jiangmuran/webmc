import { describe, it, expect } from 'vitest';
import {
  startCure,
  addBedOrBars,
  remainingTicks,
  isCured,
  BASE_CURE_MIN_TICKS,
  BASE_CURE_MAX_TICKS,
  ACCELERANT_CAP,
  MAX_SPEEDUP,
} from './zombie_villager_cure';

describe('zombie cure', () => {
  it('duration is random in [3600, 6000] (wiki)', () => {
    // rng 0 → min, rng 1-eps → max
    expect(
      remainingTicks(
        startCure(0, () => 0),
        0,
      ),
    ).toBe(BASE_CURE_MIN_TICKS);
    expect(
      remainingTicks(
        startCure(0, () => 0.99999),
        0,
      ),
    ).toBe(BASE_CURE_MAX_TICKS);
  });

  it('isCured fires after random duration elapses', () => {
    const s = startCure(0, () => 0);
    expect(isCured(s, BASE_CURE_MIN_TICKS)).toBe(true);
  });

  it('beds/bars speed up; cap at 14 accelerants for 4.2% (wiki)', () => {
    const s = startCure(0, () => 0); // min duration: 3600
    addBedOrBars(s, 14);
    // 14/14 × 4.2% speedup = 4.2% reduction
    const expected = Math.floor(BASE_CURE_MIN_TICKS * (1 - MAX_SPEEDUP));
    expect(remainingTicks(s, 0)).toBe(expected);
  });

  it('beyond 14 accelerants does not stack (wiki: capped)', () => {
    const s = startCure(0, () => 0);
    addBedOrBars(s, 100);
    expect(s.accelerantCount).toBe(ACCELERANT_CAP);
  });

  it('1 accelerant gives ~0.3% speedup', () => {
    const s = startCure(0, () => 0);
    addBedOrBars(s, 1);
    const expected = Math.floor(BASE_CURE_MIN_TICKS * (1 - MAX_SPEEDUP / ACCELERANT_CAP));
    expect(remainingTicks(s, 0)).toBe(expected);
  });
});
