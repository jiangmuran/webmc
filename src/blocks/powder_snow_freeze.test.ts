import { describe, it, expect } from 'vitest';
import {
  inPowderSnow,
  warmed,
  isFrozen,
  frostDamageThisTick,
  walkOnTopWithLeatherBoots,
  FREEZE_TICKS_MAX,
  FREEZE_DAMAGE_INTERVAL_TICKS,
} from './powder_snow_freeze';

describe('powder snow freeze', () => {
  it('builds up', () => {
    let s = { ticks: 0 };
    for (let i = 0; i < 10; i++) s = inPowderSnow(s);
    expect(s.ticks).toBe(10);
  });

  it('warmed retreats', () => {
    let s = { ticks: 100 };
    for (let i = 0; i < 10; i++) s = warmed(s);
    expect(s.ticks).toBe(80);
  });

  it('frozen threshold', () => {
    expect(isFrozen({ ticks: FREEZE_TICKS_MAX })).toBe(true);
    expect(isFrozen({ ticks: 10 })).toBe(false);
  });

  it('damage after interval', () => {
    expect(
      frostDamageThisTick({ ticks: FREEZE_TICKS_MAX }, FREEZE_DAMAGE_INTERVAL_TICKS),
    ).toBeGreaterThan(0);
  });

  it('no damage early', () => {
    expect(frostDamageThisTick({ ticks: FREEZE_TICKS_MAX }, 10)).toBe(0);
  });

  it('leather boots walk on top', () => {
    expect(walkOnTopWithLeatherBoots('leather_boots')).toBe(true);
    expect(walkOnTopWithLeatherBoots('iron_boots')).toBe(false);
  });
});
