import { describe, it, expect } from 'vitest';
import {
  freezeTick,
  takesFreezeDamage,
  visualFrostIntensity,
  DAMAGE_THRESHOLD,
  MAX_FREEZE,
} from './freeze_powder_snow';

describe('freeze powder snow', () => {
  it('freezes in snow', () => {
    expect(
      freezeTick({ freezeTicks: 0, inPowderSnow: true, wearingLeatherBoots: false }).freezeTicks,
    ).toBe(1);
  });

  it('leather boots immune', () => {
    expect(
      freezeTick({ freezeTicks: 0, inPowderSnow: true, wearingLeatherBoots: true }).freezeTicks,
    ).toBe(0);
  });

  it('thaws outside', () => {
    expect(
      freezeTick({ freezeTicks: 10, inPowderSnow: false, wearingLeatherBoots: false }).freezeTicks,
    ).toBe(8);
  });

  it('damage past threshold', () => {
    expect(
      takesFreezeDamage({
        freezeTicks: DAMAGE_THRESHOLD,
        inPowderSnow: true,
        wearingLeatherBoots: false,
      }),
    ).toBe(true);
  });

  it('frost intensity clamps 1', () => {
    expect(
      visualFrostIntensity({
        freezeTicks: MAX_FREEZE * 2,
        inPowderSnow: true,
        wearingLeatherBoots: false,
      }),
    ).toBe(1);
  });
});
