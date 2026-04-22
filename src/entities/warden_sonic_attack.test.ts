import { describe, it, expect } from 'vitest';
import {
  makeWarden,
  tryFireSonic,
  sonicDamage,
  vibrationPriorityFor,
  SONIC_COOLDOWN_MS,
  SONIC_RANGE,
  SONIC_DAMAGE,
} from './warden_sonic_attack';

describe('warden sonic', () => {
  it('fires in range with LOS', () => {
    const w = makeWarden();
    expect(tryFireSonic(w, { nowMs: 1000, targetDistance: 10, hasLineOfSight: true }).fired).toBe(
      true,
    );
  });

  it('range check', () => {
    const w = makeWarden();
    const r = tryFireSonic(w, {
      nowMs: 1000,
      targetDistance: SONIC_RANGE + 1,
      hasLineOfSight: true,
    });
    expect(r.reason).toBe('out_of_range');
  });

  it('no LOS', () => {
    const w = makeWarden();
    expect(tryFireSonic(w, { nowMs: 0, targetDistance: 5, hasLineOfSight: false }).reason).toBe(
      'no_los',
    );
  });

  it('cooldown', () => {
    const w = makeWarden();
    tryFireSonic(w, { nowMs: 0, targetDistance: 5, hasLineOfSight: true });
    expect(tryFireSonic(w, { nowMs: 100, targetDistance: 5, hasLineOfSight: true }).reason).toBe(
      'cooldown',
    );
    expect(
      tryFireSonic(w, { nowMs: SONIC_COOLDOWN_MS + 1, targetDistance: 5, hasLineOfSight: true })
        .fired,
    ).toBe(true);
  });

  it('damage constant', () => {
    expect(sonicDamage()).toBe(SONIC_DAMAGE);
  });

  it('vibration priority', () => {
    expect(vibrationPriorityFor('projectile_shoot')).toBeGreaterThan(
      vibrationPriorityFor('footstep'),
    );
  });
});
