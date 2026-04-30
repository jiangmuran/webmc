import { describe, it, expect } from 'vitest';
import {
  allowedPrimariesForLevel,
  allowsSecondary,
  secondaryOptions,
  effectAt,
  effectDurationTicksForTier,
} from './beacon_effect_apply';

describe('beacon apply', () => {
  it('primaries grow with level', () => {
    expect(allowedPrimariesForLevel(1).length).toBeLessThan(allowedPrimariesForLevel(3).length);
  });

  it('secondary requires level 4', () => {
    expect(allowsSecondary(3)).toBe(false);
    expect(allowsSecondary(4)).toBe(true);
  });

  it('secondary has regen option', () => {
    expect(secondaryOptions('speed')).toContain('regeneration');
  });

  it('no primary = no effect', () => {
    const r = effectAt({
      beacon: { level: 4, primary: null, secondary: null },
      playerDistance: 1,
      radius: 50,
    });
    expect(r.effect).toBeNull();
  });

  it('out of range = none', () => {
    const r = effectAt({
      beacon: { level: 1, primary: 'speed', secondary: null },
      playerDistance: 100,
      radius: 20,
    });
    expect(r.effect).toBeNull();
  });

  it('matching secondary upgrades amplifier', () => {
    const r = effectAt({
      beacon: { level: 4, primary: 'speed', secondary: 'speed' },
      playerDistance: 1,
      radius: 50,
    });
    expect(r.amplifier).toBe(1);
    expect(r.durationTicks).toBe(effectDurationTicksForTier(4));
  });

  it('duration scales with pyramid tier (wiki: 9 + 2*tier seconds)', () => {
    expect(effectDurationTicksForTier(1)).toBe(11 * 20);
    expect(effectDurationTicksForTier(2)).toBe(13 * 20);
    expect(effectDurationTicksForTier(3)).toBe(15 * 20);
    expect(effectDurationTicksForTier(4)).toBe(17 * 20);
  });
});
