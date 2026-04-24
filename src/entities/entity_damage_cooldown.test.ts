import { describe, it, expect } from 'vitest';
import { canDamage, applyDamage, tick, DEFAULT_COOLDOWN_TICKS } from './entity_damage_cooldown';

describe('entity damage cooldown', () => {
  it('empty cooldown allows', () => {
    expect(canDamage({ remainingTicks: 0, lastDamage: 0 }, 5)).toBe(true);
  });

  it('weaker hit during cooldown blocked', () => {
    expect(canDamage({ remainingTicks: 5, lastDamage: 10 }, 5)).toBe(false);
  });

  it('stronger hit during cooldown allowed', () => {
    expect(canDamage({ remainingTicks: 5, lastDamage: 5 }, 10)).toBe(true);
  });

  it('apply sets duration', () => {
    expect(applyDamage({ remainingTicks: 0, lastDamage: 0 }, 7).remainingTicks).toBe(
      DEFAULT_COOLDOWN_TICKS,
    );
  });

  it('tick decrements', () => {
    expect(tick({ remainingTicks: 5, lastDamage: 3 }).remainingTicks).toBe(4);
  });

  it('tick reaches zero clears', () => {
    expect(tick({ remainingTicks: 1, lastDamage: 3 }).lastDamage).toBe(0);
  });
});
