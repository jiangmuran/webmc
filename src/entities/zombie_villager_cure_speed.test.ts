import { describe, it, expect } from 'vitest';
import {
  isCuring,
  cureDurationTicks,
  rollCureDuration,
  BASE_CURE_TICKS,
  BASE_CURE_MIN_TICKS,
  BASE_CURE_MAX_TICKS,
  ACCELERANT_CAP,
  MAX_SPEEDUP,
} from './zombie_villager_cure_speed';

describe('zombie villager cure speed', () => {
  const noAccel = { ironBarsNearby: 0, bedHalvesNearby: 0 };

  it('requires weakness + golden apple (wiki)', () => {
    expect(isCuring({ ...noAccel, weaknessApplied: true, goldenAppleUsed: true })).toBe(true);
    expect(isCuring({ ...noAccel, weaknessApplied: false, goldenAppleUsed: true })).toBe(false);
    expect(isCuring({ ...noAccel, weaknessApplied: true, goldenAppleUsed: false })).toBe(false);
  });

  it('base cure duration with no accelerants', () => {
    expect(cureDurationTicks({ ...noAccel, weaknessApplied: true, goldenAppleUsed: true })).toBe(
      BASE_CURE_TICKS,
    );
  });

  it('14 accelerants → 4.2% speedup (wiki cap)', () => {
    const expected = Math.floor(BASE_CURE_TICKS * (1 - MAX_SPEEDUP));
    expect(
      cureDurationTicks({
        ironBarsNearby: 14,
        bedHalvesNearby: 0,
        weaknessApplied: true,
        goldenAppleUsed: true,
      }),
    ).toBe(expected);
  });

  it('iron bars and bed halves count equally (wiki: each half-bed counts)', () => {
    const a = cureDurationTicks({
      ironBarsNearby: 7,
      bedHalvesNearby: 7,
      weaknessApplied: true,
      goldenAppleUsed: true,
    });
    const b = cureDurationTicks({
      ironBarsNearby: 14,
      bedHalvesNearby: 0,
      weaknessApplied: true,
      goldenAppleUsed: true,
    });
    expect(a).toBe(b);
  });

  it('beyond 14 accelerants does not stack (wiki: capped)', () => {
    const a = cureDurationTicks({
      ironBarsNearby: 100,
      bedHalvesNearby: 100,
      weaknessApplied: true,
      goldenAppleUsed: true,
    });
    const cap = cureDurationTicks({
      ironBarsNearby: ACCELERANT_CAP,
      bedHalvesNearby: 0,
      weaknessApplied: true,
      goldenAppleUsed: true,
    });
    expect(a).toBe(cap);
  });

  it('not curing → undefined', () => {
    expect(
      cureDurationTicks({ ...noAccel, weaknessApplied: false, goldenAppleUsed: false }),
    ).toBeUndefined();
  });

  it('floor prevents 0 (min 20 ticks)', () => {
    expect(
      cureDurationTicks(
        {
          ironBarsNearby: 14,
          bedHalvesNearby: 0,
          weaknessApplied: true,
          goldenAppleUsed: true,
        },
        100,
      ),
    ).toBeGreaterThanOrEqual(20);
  });

  it('rollCureDuration in [3600, 6000] (wiki)', () => {
    expect(rollCureDuration(() => 0)).toBe(BASE_CURE_MIN_TICKS);
    expect(rollCureDuration(() => 0.99999)).toBe(BASE_CURE_MAX_TICKS);
  });
});
