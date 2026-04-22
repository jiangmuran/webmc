import { describe, it, expect } from 'vitest';
import { makeGhast, acquire, tryFire, deflect, FIRE_INTERVAL_MS } from './ghast_behavior';

describe('ghast', () => {
  it('acquires visible target', () => {
    const s = makeGhast();
    acquire(s, { visiblePlayerId: 'p', distance: 20, hasLineOfSight: true });
    expect(s.targetId).toBe('p');
  });

  it('loses target on LOS', () => {
    const s = makeGhast();
    acquire(s, { visiblePlayerId: 'p', distance: 20, hasLineOfSight: true });
    acquire(s, { visiblePlayerId: 'p', distance: 20, hasLineOfSight: false });
    expect(s.targetId).toBeNull();
  });

  it('out of range no target', () => {
    const s = makeGhast();
    acquire(s, { visiblePlayerId: 'p', distance: 200, hasLineOfSight: true });
    expect(s.targetId).toBeNull();
  });

  it('fire rate limit', () => {
    const s = makeGhast();
    acquire(s, { visiblePlayerId: 'p', distance: 20, hasLineOfSight: true });
    expect(tryFire(s, { nowMs: 0 })).toBe(true);
    expect(tryFire(s, { nowMs: 100 })).toBe(false);
    expect(tryFire(s, { nowMs: FIRE_INTERVAL_MS + 1 })).toBe(true);
  });

  it('deflect redirects', () => {
    const r = deflect({ hitByMelee: true, attackerId: 'Steve', ghastId: 'g' });
    expect(r.redirectTargetId).toBe('g');
  });

  it('deflect hits ghast if attacker is ghast', () => {
    const r = deflect({ hitByMelee: true, attackerId: 'g', ghastId: 'g' });
    expect(r.damagedGhastId).toBe('g');
  });
});
