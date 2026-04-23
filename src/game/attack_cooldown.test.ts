import { describe, it, expect } from 'vitest';
import { strengthPct, damageMultiplier, onSwing, tick, fullyCharged } from './attack_cooldown';

describe('attack cooldown', () => {
  it('just-swung = 20%', () => {
    expect(strengthPct({ attackSpeedAttribute: 4, ticksSinceLastSwing: 0 })).toBeCloseTo(0.2);
  });

  it('full charge = 100%', () => {
    expect(strengthPct({ attackSpeedAttribute: 4, ticksSinceLastSwing: 100 })).toBeCloseTo(1);
  });

  it('swing resets', () => {
    const c = onSwing({ attackSpeedAttribute: 4, ticksSinceLastSwing: 20 });
    expect(c.ticksSinceLastSwing).toBe(0);
  });

  it('tick increments', () => {
    expect(tick({ attackSpeedAttribute: 4, ticksSinceLastSwing: 5 }).ticksSinceLastSwing).toBe(6);
  });

  it('damage = strength', () => {
    const c = { attackSpeedAttribute: 4, ticksSinceLastSwing: 100 };
    expect(damageMultiplier(c)).toBeCloseTo(strengthPct(c));
  });

  it('fullyCharged after window', () => {
    expect(fullyCharged({ attackSpeedAttribute: 4, ticksSinceLastSwing: 100 })).toBe(true);
  });
});
