import { describe, it, expect } from 'vitest';
import { isHostileToZoglin, knockbackStrength, canTargetInNether } from './zoglin_attack_targets';

describe('zoglin attack targets', () => {
  it('attacks player', () => {
    expect(isHostileToZoglin('player')).toBe(true);
  });

  it('ignores zoglin', () => {
    expect(isHostileToZoglin('zoglin')).toBe(false);
  });

  it('ignores creeper', () => {
    expect(isHostileToZoglin('creeper')).toBe(false);
  });

  it('high knockback', () => {
    expect(knockbackStrength()).toBeGreaterThan(1);
  });

  it('works in nether', () => {
    expect(canTargetInNether()).toBe(true);
  });
});
