import { describe, it, expect } from 'vitest';
import {
  disableShieldAt,
  SHIELD_DISABLE_SEC,
  shieldDisableCheck,
  tickShieldRaise,
} from './shield_disable_time';

describe('shield disabling', () => {
  it('axe on raised shield disables', () => {
    const r = shieldDisableCheck({
      attackerWeapon: 'axe',
      attackerSprintingOrCharged: false,
      shieldWasRaised: true,
    });
    expect(r.disabled).toBe(true);
    expect(r.durationSec).toBe(SHIELD_DISABLE_SEC);
  });

  it('sword does not disable', () => {
    expect(
      shieldDisableCheck({
        attackerWeapon: 'sword',
        attackerSprintingOrCharged: true,
        shieldWasRaised: true,
      }).disabled,
    ).toBe(false);
  });

  it('lowered shield + uncharged axe = no disable', () => {
    expect(
      shieldDisableCheck({
        attackerWeapon: 'axe',
        attackerSprintingOrCharged: false,
        shieldWasRaised: false,
      }).disabled,
    ).toBe(false);
  });
});

describe('shield raise activation', () => {
  it('raises after 5 ticks', () => {
    const state = { holdingSecondary: false, raiseTicks: 0, disabledUntilTicks: 0 };
    for (let i = 0; i < 4; i++) {
      tickShieldRaise(state, { nowTicks: i, secondaryHeld: true });
    }
    expect(tickShieldRaise(state, { nowTicks: 4, secondaryHeld: true })).toBe(true);
  });

  it('release resets', () => {
    const state = { holdingSecondary: false, raiseTicks: 4, disabledUntilTicks: 0 };
    tickShieldRaise(state, { nowTicks: 5, secondaryHeld: false });
    expect(state.raiseTicks).toBe(0);
  });

  it('disabled shield does not raise', () => {
    const state = { holdingSecondary: false, raiseTicks: 0, disabledUntilTicks: 100 };
    expect(tickShieldRaise(state, { nowTicks: 50, secondaryHeld: true })).toBe(false);
  });

  it('disableShieldAt sets timer', () => {
    const state = { holdingSecondary: false, raiseTicks: 0, disabledUntilTicks: 0 };
    disableShieldAt(state, 100, 5);
    expect(state.disabledUntilTicks).toBe(200);
  });
});
