import { describe, it, expect } from 'vitest';
import { destroyEndCrystal, makeEndCrystal, tickEndCrystal } from './end_crystal';

describe('end crystal', () => {
  it('heals the dragon when in range + damaged', () => {
    const c = makeEndCrystal(1, { x: 0, y: 80, z: 0 });
    const r = tickEndCrystal(c, 2, {
      dragonId: 99,
      dragonPos: { x: 0, y: 80, z: 0 },
      dragonInRange: true,
      dragonCurrentHp: 100,
      dragonMaxHp: 200,
    });
    expect(r.appliedHeal).toBeGreaterThan(0);
    expect(c.beamTargetId).toBe(99);
  });

  it('no heal at full HP', () => {
    const c = makeEndCrystal(1, { x: 0, y: 80, z: 0 });
    const r = tickEndCrystal(c, 2, {
      dragonId: 99,
      dragonPos: { x: 0, y: 80, z: 0 },
      dragonInRange: true,
      dragonCurrentHp: 200,
      dragonMaxHp: 200,
    });
    expect(r.appliedHeal).toBe(0);
  });

  it('no heal out of range', () => {
    const c = makeEndCrystal(1, { x: 0, y: 80, z: 0 });
    const r = tickEndCrystal(c, 2, {
      dragonId: 99,
      dragonPos: { x: 1000, y: 80, z: 0 },
      dragonInRange: false,
      dragonCurrentHp: 100,
      dragonMaxHp: 200,
    });
    expect(r.appliedHeal).toBe(0);
    expect(c.beamTargetId).toBeNull();
  });

  it('destroy explodes with power 6', () => {
    const c = makeEndCrystal(1, { x: 0, y: 80, z: 0 });
    const r = destroyEndCrystal(c);
    expect(r.exploded).toBe(true);
    expect(r.explosionPower).toBe(6);
    expect(c.active).toBe(false);
  });

  it('destroyed crystal cannot detonate again', () => {
    const c = makeEndCrystal(1, { x: 0, y: 80, z: 0 });
    destroyEndCrystal(c);
    expect(destroyEndCrystal(c).exploded).toBe(false);
  });
});
