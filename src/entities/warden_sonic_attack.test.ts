import { describe, it, expect } from 'vitest';
import {
  makeWarden,
  tryFireSonic,
  sonicDamage,
  vibrationPriorityFor,
  SONIC_COOLDOWN_MS,
  SONIC_RANGE,
  SONIC_RANGE_HORIZONTAL,
  SONIC_RANGE_VERTICAL,
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

  it('vibration frequency higher for shooting than walking (wiki: 3 vs 1)', () => {
    expect(vibrationPriorityFor('projectile_shoot')).toBeGreaterThan(
      vibrationPriorityFor('footstep'),
    );
  });

  it('wiki canonical frequencies (minecraft.wiki/w/Vibration)', () => {
    expect(vibrationPriorityFor('footstep')).toBe(1);
    expect(vibrationPriorityFor('projectile_land')).toBe(2);
    expect(vibrationPriorityFor('projectile_shoot')).toBe(3);
    expect(vibrationPriorityFor('entity_damage')).toBe(7);
    expect(vibrationPriorityFor('container_open')).toBe(10);
    expect(vibrationPriorityFor('block_break')).toBe(12);
    expect(vibrationPriorityFor('block_place')).toBe(13);
  });

  it('cooldown is 3s per wiki (1.7s charge + 1.3s cooldown)', () => {
    // Wiki minecraft.wiki/w/Warden: "1.7 seconds to charge ... 1.3
    // seconds to cool down ... total of 3 seconds before melee
    // resumes." Old 5000 ms was 67% over.
    expect(SONIC_COOLDOWN_MS).toBe(3000);
  });

  it('sonic range is ovoid 14h × 20v per wiki (not a flat sphere)', () => {
    // Wiki: "within a 14-block radius horizontally and 20 blocks
    // vertically of the warden in an OVOID shape."
    expect(SONIC_RANGE_HORIZONTAL).toBe(14);
    expect(SONIC_RANGE_VERTICAL).toBe(20);
    // Far-field bound for back-compat callers using flat distance.
    expect(SONIC_RANGE).toBe(20);

    const w = makeWarden();
    // Inside ovoid: h=10, v=10 → (10/14)² + (10/20)² = 0.51 + 0.25 = 0.76 ≤ 1.
    expect(
      tryFireSonic(w, {
        nowMs: 0,
        targetDistance: 20,
        horizontalDistance: 10,
        verticalDistance: 10,
        hasLineOfSight: true,
      }).fired,
    ).toBe(true);

    const w2 = makeWarden();
    // Outside ovoid: h=18, v=0 → (18/14)² + 0 = 1.65 > 1, even though
    // the legacy spherical check would accept (18 < 20).
    expect(
      tryFireSonic(w2, {
        nowMs: 0,
        targetDistance: 18,
        horizontalDistance: 18,
        verticalDistance: 0,
        hasLineOfSight: true,
      }).reason,
    ).toBe('out_of_range');
  });
});
