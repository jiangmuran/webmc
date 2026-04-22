import { describe, it, expect } from 'vitest';
import { makeAttackState, swing, cooldownFraction, damageMultiplier } from './hud_attack_indicator';

describe('attack indicator', () => {
  it('fresh state = full cd', () => {
    const s = makeAttackState(1.6);
    expect(cooldownFraction(s, 1000)).toBe(1);
  });

  it('just swung = 0 cd', () => {
    const s = makeAttackState(1.6);
    swing(s, 0);
    expect(cooldownFraction(s, 0)).toBe(0);
  });

  it('half interval = 0.5', () => {
    const s = makeAttackState(1);
    swing(s, 0);
    expect(cooldownFraction(s, 500)).toBeCloseTo(0.5);
  });

  it('damage mult curves', () => {
    const s = makeAttackState(1);
    swing(s, 0);
    expect(damageMultiplier(s, 0)).toBeCloseTo(0.2);
    expect(damageMultiplier(s, 10_000)).toBeCloseTo(1);
  });
});
