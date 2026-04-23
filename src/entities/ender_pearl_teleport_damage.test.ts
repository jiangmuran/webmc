import { describe, it, expect } from 'vitest';
import { appliesFallDamage, cooldownTicks, pearlDamage } from './ender_pearl_teleport_damage';

describe('ender pearl teleport damage', () => {
  it('standing takes damage', () => {
    expect(appliesFallDamage(false)).toBe(true);
  });

  it('riding skips damage', () => {
    expect(appliesFallDamage(true)).toBe(false);
  });

  it('cooldown 20', () => {
    expect(cooldownTicks()).toBe(20);
  });

  it('damage 5', () => {
    expect(pearlDamage()).toBe(5);
  });
});
