import { describe, it, expect } from 'vitest';
import {
  shouldApplyRegen,
  heartsPerSecond,
  regenIntervalTicks,
} from './player_health_regen_effects';

describe('player regen effects', () => {
  it('base interval 50', () => {
    expect(regenIntervalTicks(0)).toBe(50);
  });

  it('higher amp faster', () => {
    expect(regenIntervalTicks(4)).toBeLessThan(regenIntervalTicks(0));
  });

  it('no effect no regen', () => {
    expect(
      shouldApplyRegen({
        hp: 10,
        maxHp: 20,
        hasRegeneration: false,
        regenAmplifier: 0,
        ticksSinceLastRegen: 100,
      }),
    ).toBe(false);
  });

  it('full hp no regen', () => {
    expect(
      shouldApplyRegen({
        hp: 20,
        maxHp: 20,
        hasRegeneration: true,
        regenAmplifier: 0,
        ticksSinceLastRegen: 100,
      }),
    ).toBe(false);
  });

  it('ready regen', () => {
    expect(
      shouldApplyRegen({
        hp: 10,
        maxHp: 20,
        hasRegeneration: true,
        regenAmplifier: 0,
        ticksSinceLastRegen: 50,
      }),
    ).toBe(true);
  });

  it('hearts per sec scales', () => {
    expect(heartsPerSecond(4)).toBeGreaterThan(heartsPerSecond(0));
  });
});
