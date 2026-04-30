import { describe, it, expect } from 'vitest';
import {
  onAxeHitShield,
  shieldDisabled,
  axeEfficiencyBonus,
  DISABLE_BASE_MS,
  DISABLE_CRIT_MS,
} from './shield_disable_axe';

describe('shield disable by axe', () => {
  it('axe disables', () => {
    const s = { disabledUntilMs: 0 };
    onAxeHitShield(s, { isAxe: true, isCrit: false, nowMs: 0 });
    expect(shieldDisabled(s, DISABLE_BASE_MS - 1)).toBe(true);
    expect(shieldDisabled(s, DISABLE_BASE_MS + 1)).toBe(false);
  });

  it('crit uses same 5s window as non-crit (wiki)', () => {
    // Wiki: shield is disabled for 5 seconds, regardless of crit.
    const s = { disabledUntilMs: 0 };
    onAxeHitShield(s, { isAxe: true, isCrit: true, nowMs: 0 });
    expect(DISABLE_CRIT_MS).toBe(DISABLE_BASE_MS);
    expect(shieldDisabled(s, DISABLE_BASE_MS - 1)).toBe(true);
    expect(shieldDisabled(s, DISABLE_BASE_MS + 1)).toBe(false);
  });

  it('non-axe no-op', () => {
    const s = { disabledUntilMs: 0 };
    expect(onAxeHitShield(s, { isAxe: false, isCrit: false, nowMs: 0 })).toBe(false);
  });

  it('efficiency bonus', () => {
    expect(axeEfficiencyBonus('netherite')).toBeGreaterThan(axeEfficiencyBonus('wood'));
  });
});
