import { describe, it, expect } from 'vitest';
import { canFire, damage, ignoresArmor, SONIC_RANGE } from './warden_sonic_ranged';

describe('warden sonic ranged', () => {
  it('close and ready fires', () => {
    expect(canFire({ distanceToTarget: 10, cooldownTicksRemaining: 0 })).toBe(true);
  });

  it('cooldown blocks', () => {
    expect(canFire({ distanceToTarget: 10, cooldownTicksRemaining: 10 })).toBe(false);
  });

  it('out of range blocks', () => {
    expect(canFire({ distanceToTarget: SONIC_RANGE + 1, cooldownTicksRemaining: 0 })).toBe(false);
  });

  it('damage > 0 when ready', () => {
    expect(damage({ distanceToTarget: 5, cooldownTicksRemaining: 0 })).toBeGreaterThan(0);
  });

  it('ignores armor', () => {
    expect(ignoresArmor()).toBe(true);
  });
});
