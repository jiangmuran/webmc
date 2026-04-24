import { describe, it, expect } from 'vitest';
import { isCuring, cureDurationTicks, BASE_CURE_TICKS } from './zombie_villager_cure_speed';

describe('zombie villager cure speed', () => {
  it('requires both effects', () => {
    expect(
      isCuring({
        onIronBarsNearby: false,
        onBedNearby: false,
        regenII: true,
        weaknessApplied: true,
      }),
    ).toBe(true);
    expect(
      isCuring({
        onIronBarsNearby: false,
        onBedNearby: false,
        regenII: false,
        weaknessApplied: true,
      }),
    ).toBe(false);
  });

  it('base cure duration', () => {
    expect(
      cureDurationTicks({
        onIronBarsNearby: false,
        onBedNearby: false,
        regenII: true,
        weaknessApplied: true,
      }),
    ).toBe(BASE_CURE_TICKS);
  });

  it('iron bars speed up', () => {
    expect(
      cureDurationTicks({
        onIronBarsNearby: true,
        onBedNearby: false,
        regenII: true,
        weaknessApplied: true,
      }) ?? 0,
    ).toBeLessThan(BASE_CURE_TICKS);
  });

  it('not curing undefined', () => {
    expect(
      cureDurationTicks({
        onIronBarsNearby: true,
        onBedNearby: false,
        regenII: false,
        weaknessApplied: false,
      }),
    ).toBeUndefined();
  });

  it('floor prevents 0', () => {
    expect(
      cureDurationTicks({
        onIronBarsNearby: true,
        onBedNearby: true,
        regenII: true,
        weaknessApplied: true,
      }) ?? 0,
    ).toBeGreaterThanOrEqual(20);
  });
});
