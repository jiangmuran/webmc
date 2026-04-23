import { describe, it, expect } from 'vitest';
import { damageOnHit, hitVelocity, targetsAttackersOnly, SPIT_DAMAGE } from './llama_spit_damage';

describe('llama spit damage', () => {
  it('damage 1', () => {
    expect(damageOnHit()).toBe(SPIT_DAMAGE);
  });

  it('velocity directed', () => {
    const v = hitVelocity(10, 0);
    expect(v.vx).toBeGreaterThan(0);
    expect(v.vz).toBe(0);
  });

  it('zero distance zero velocity', () => {
    expect(hitVelocity(0, 0)).toEqual({ vx: 0, vz: 0 });
  });

  it('defensive targeting', () => {
    expect(targetsAttackersOnly()).toBe(true);
  });
});
