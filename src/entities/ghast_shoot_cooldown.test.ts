import { describe, it, expect } from 'vitest';
import { canShoot, retreatWhileCharging, FIREBALL_COOLDOWN_TICKS } from './ghast_shoot_cooldown';

describe('ghast shoot cooldown', () => {
  it('shoots when cooled down', () => {
    expect(canShoot({ tickSinceLastShot: FIREBALL_COOLDOWN_TICKS, hasTarget: true })).toBe(true);
  });

  it('waits during cooldown', () => {
    expect(canShoot({ tickSinceLastShot: 10, hasTarget: true })).toBe(false);
  });

  it('no target no shoot', () => {
    expect(canShoot({ tickSinceLastShot: 1000, hasTarget: false })).toBe(false);
  });

  it('retreats while charging', () => {
    expect(retreatWhileCharging({ tickSinceLastShot: 5, hasTarget: true })).toBe(true);
  });
});
