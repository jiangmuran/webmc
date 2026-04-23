import { describe, it, expect } from 'vitest';
import { finalKnockback, isImmune } from './hostile_mob_knockback_resistance';

describe('knockback resistance', () => {
  it('no resist full KB', () => {
    expect(finalKnockback({ incomingForce: 1, resistance: 0, wearingArmor: false })).toBe(1);
  });

  it('half resist half KB', () => {
    expect(finalKnockback({ incomingForce: 1, resistance: 0.5, wearingArmor: false })).toBe(0.5);
  });

  it('armor dampens', () => {
    expect(finalKnockback({ incomingForce: 1, resistance: 0, wearingArmor: true })).toBeLessThan(1);
  });

  it('immune', () => {
    expect(isImmune({ incomingForce: 1, resistance: 1, wearingArmor: false })).toBe(true);
  });
});
