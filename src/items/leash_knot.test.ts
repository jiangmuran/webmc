import { describe, it, expect } from 'vitest';
import {
  computePull,
  destroyKnot,
  LEASH_MAX_DISTANCE,
  makeLeashKnot,
  tieMob,
  untieMob,
} from './leash_knot';

describe('leash knot', () => {
  it('tie close mob', () => {
    const knot = makeLeashKnot(1, { x: 0, y: 60, z: 0 });
    const r = tieMob({ knot, mobId: 5, mobPos: { x: 2, y: 60, z: 0 } });
    expect(r.tied).toBe(true);
  });

  it('tie far mob refused', () => {
    const knot = makeLeashKnot(1, { x: 0, y: 60, z: 0 });
    const r = tieMob({ knot, mobId: 5, mobPos: { x: 100, y: 60, z: 0 } });
    expect(r.reason).toBe('too_far');
  });

  it('double-tie refused', () => {
    const knot = makeLeashKnot(1, { x: 0, y: 60, z: 0 });
    tieMob({ knot, mobId: 5, mobPos: { x: 1, y: 60, z: 0 } });
    expect(tieMob({ knot, mobId: 5, mobPos: { x: 1, y: 60, z: 0 } }).reason).toBe('already_tied');
  });

  it('untie', () => {
    const knot = makeLeashKnot(1, { x: 0, y: 60, z: 0 });
    tieMob({ knot, mobId: 5, mobPos: { x: 1, y: 60, z: 0 } });
    expect(untieMob(knot, 5)).toBe(true);
  });

  it('pull force near max distance', () => {
    const knot = makeLeashKnot(1, { x: 0, y: 60, z: 0 });
    tieMob({ knot, mobId: 5, mobPos: { x: 9, y: 60, z: 0 } });
    const r = computePull({
      knot,
      mobId: 5,
      mobPos: { x: LEASH_MAX_DISTANCE + 0.5, y: 60, z: 0 },
    });
    expect(r.pullForce.x).toBeLessThan(0);
    expect(r.shouldSnap).toBe(false);
  });

  it('snap when overstretched', () => {
    const knot = makeLeashKnot(1, { x: 0, y: 60, z: 0 });
    tieMob({ knot, mobId: 5, mobPos: { x: 5, y: 60, z: 0 } });
    const r = computePull({ knot, mobId: 5, mobPos: { x: 20, y: 60, z: 0 } });
    expect(r.shouldSnap).toBe(true);
  });

  it('destroy frees all mobs', () => {
    const knot = makeLeashKnot(1, { x: 0, y: 60, z: 0 });
    tieMob({ knot, mobId: 5, mobPos: { x: 1, y: 60, z: 0 } });
    tieMob({ knot, mobId: 6, mobPos: { x: 1, y: 60, z: 0 } });
    const freed = destroyKnot(knot);
    expect(freed.length).toBe(2);
  });
});
