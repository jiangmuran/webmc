import { describe, it, expect } from 'vitest';
import {
  dropTarget,
  makeWolf,
  onOwnerDamaged,
  onWildWolfHit,
  shouldFlee,
  WOLF_MAX_HEALTH_TAMED,
  WOLF_MAX_HEALTH_WILD,
} from './wolf_anger';

describe('wolf anger', () => {
  it('tamed wolf has 40 HP (wiki)', () => {
    expect(WOLF_MAX_HEALTH_TAMED).toBe(40);
    expect(makeWolf(1, true, 'p1').health).toBe(WOLF_MAX_HEALTH_TAMED);
  });

  it('wild wolf has 8 HP (wiki)', () => {
    expect(WOLF_MAX_HEALTH_WILD).toBe(8);
    expect(makeWolf(1, false).health).toBe(WOLF_MAX_HEALTH_WILD);
  });

  it('tamed wolf retaliates when owner hit', () => {
    const w = makeWolf(1, true, 'p1');
    onOwnerDamaged(w, 42);
    expect(w.targetId).toBe(42);
    expect(w.hostileToMobs.has(42)).toBe(true);
  });

  it('wild wolf ignores owner hits', () => {
    const w = makeWolf(1, false);
    onOwnerDamaged(w, 42);
    expect(w.targetId).toBeNull();
  });

  it('wild pack aggros together', () => {
    const victim = makeWolf(1, false);
    const packmate = makeWolf(2, false);
    const r = onWildWolfHit(victim, [packmate], 99);
    expect(r.aggroIds).toContain(1);
    expect(r.aggroIds).toContain(2);
  });

  it('tamed pack members ignore pack aggro', () => {
    const victim = makeWolf(1, false);
    const tame = makeWolf(2, true, 'p1');
    onWildWolfHit(victim, [tame], 99);
    expect(tame.targetId).toBeNull();
  });

  it('wild wolf flees at low HP', () => {
    const w = makeWolf(1, false);
    w.health = 4;
    expect(shouldFlee(w)).toBe(true);
  });

  it('tamed wolf never flees', () => {
    const w = makeWolf(1, true, 'p1');
    w.health = 1;
    expect(shouldFlee(w)).toBe(false);
  });

  it('dropTarget clears', () => {
    const w = makeWolf(1, true, 'p1');
    w.targetId = 42;
    dropTarget(w);
    expect(w.targetId).toBeNull();
  });
});
