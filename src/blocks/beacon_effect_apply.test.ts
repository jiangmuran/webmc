import { describe, it, expect } from 'vitest';
import {
  allowedPrimariesForLevel,
  allowsSecondary,
  secondaryOptions,
  effectAt,
  EFFECT_DURATION_TICKS,
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
    expect(r.durationTicks).toBe(EFFECT_DURATION_TICKS);
  });
});
