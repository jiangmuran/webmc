import { describe, it, expect } from 'vitest';
import {
  makeGhast,
  acquire,
  tryFire,
  deflect,
  FIRE_INTERVAL_MS,
  DETECT_RANGE_VERTICAL,
} from './ghast_behavior';

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

  it('rejects target outside vertical 4-block range per wiki', () => {
    // minecraft.wiki/w/Ghast — Java targets within 64 horizontal
    // and 4 vertical blocks (MC-49640 WAI).
    expect(DETECT_RANGE_VERTICAL).toBe(4);
    const s = makeGhast();
    acquire(s, {
      visiblePlayerId: 'p',
      distance: 20,
      distanceY: DETECT_RANGE_VERTICAL + 0.1,
      hasLineOfSight: true,
    });
    expect(s.targetId).toBeNull();
  });

  it('accepts target inside vertical 4-block range', () => {
    const s = makeGhast();
    acquire(s, { visiblePlayerId: 'p', distance: 20, distanceY: -3, hasLineOfSight: true });
    expect(s.targetId).toBe('p');
  });
});
