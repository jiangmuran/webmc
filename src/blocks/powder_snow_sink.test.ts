import { describe, it, expect } from 'vitest';
import {
  sinks,
  freezeDamageApplied,
  canStandOnLeatherBoots,
  FREEZE_DAMAGE_START,
} from './powder_snow_sink';

describe('powder snow sink', () => {
  it('unbooted sinks', () => {
    expect(sinks({ wearingLeatherBoots: false, falling: true, freezeTicks: 0 })).toBe(true);
  });

  it('leather boots save', () => {
    expect(sinks({ wearingLeatherBoots: true, falling: true, freezeTicks: 0 })).toBe(false);
    expect(canStandOnLeatherBoots()).toBe(true);
  });

  it('damage starts late', () => {
    expect(
      freezeDamageApplied({ wearingLeatherBoots: false, falling: false, freezeTicks: 100 }),
    ).toBe(0);
    expect(
      freezeDamageApplied({
        wearingLeatherBoots: false,
        falling: false,
        freezeTicks: FREEZE_DAMAGE_START,
      }),
    ).toBeGreaterThan(0);
  });
});
