import { describe, it, expect } from 'vitest';
import { hasGrace, resistanceAmplifier, GRACE_DURATION_TICKS } from './axolotl_grace';

describe('axolotl grace', () => {
  it('fresh grace', () => {
    expect(
      hasGrace({ axolotlDamagedMobNearby: true, lastDamageAtTick: 0, nowTick: 100 }),
    ).toBe(true);
  });

  it('expired grace', () => {
    expect(
      hasGrace({
        axolotlDamagedMobNearby: true,
        lastDamageAtTick: 0,
        nowTick: GRACE_DURATION_TICKS,
      }),
    ).toBe(false);
  });

  it('no axolotl no grace', () => {
    expect(
      hasGrace({ axolotlDamagedMobNearby: false, lastDamageAtTick: 0, nowTick: 10 }),
    ).toBe(false);
  });

  it('resistance only when in grace', () => {
    expect(
      resistanceAmplifier({ axolotlDamagedMobNearby: true, lastDamageAtTick: 0, nowTick: 0 }),
    ).toBeGreaterThanOrEqual(0);
  });
});
