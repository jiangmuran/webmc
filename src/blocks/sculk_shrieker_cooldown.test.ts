import { describe, it, expect } from 'vitest';
import {
  tryShriek,
  shouldSummonWarden,
  darknessDurationTicks,
  SHRIEK_COOLDOWN_TICKS,
  WARNING_LEVEL_MAX,
} from './sculk_shrieker_cooldown';

describe('sculk shrieker', () => {
  it('shriek increments warning', () => {
    const s = { lastShriekTick: -1000, canSummon: true };
    const r = tryShriek(s, { nowTick: 0, detectedVibration: true }, 0);
    expect(r.shrieked).toBe(true);
    expect(r.nextWarningLevel).toBe(1);
  });

  it('cooldown blocks', () => {
    const s = { lastShriekTick: 0, canSummon: true };
    const r = tryShriek(s, { nowTick: 10, detectedVibration: true }, 0);
    expect(r.shrieked).toBe(false);
  });

  it('warning capped', () => {
    const s = { lastShriekTick: -1000, canSummon: true };
    const r = tryShriek(s, { nowTick: 0, detectedVibration: true }, WARNING_LEVEL_MAX);
    expect(r.nextWarningLevel).toBe(WARNING_LEVEL_MAX);
  });

  it('summon at max if canSummon', () => {
    expect(shouldSummonWarden({ lastShriekTick: 0, canSummon: true }, WARNING_LEVEL_MAX)).toBe(
      true,
    );
    expect(shouldSummonWarden({ lastShriekTick: 0, canSummon: false }, WARNING_LEVEL_MAX)).toBe(
      false,
    );
  });

  it('darkness fixed 12s = 240 ticks (wiki)', () => {
    expect(darknessDurationTicks(0)).toBe(240);
    expect(darknessDurationTicks(WARNING_LEVEL_MAX)).toBe(240);
  });

  it('next shriek after cooldown', () => {
    const s = { lastShriekTick: 0, canSummon: true };
    expect(
      tryShriek(s, { nowTick: SHRIEK_COOLDOWN_TICKS + 1, detectedVibration: true }, 0).shrieked,
    ).toBe(true);
  });
});
