import { describe, it, expect } from 'vitest';
import { ProjectileWorld } from './projectile';

const noFloor = (): boolean => false;
const floorAtY40 = (_x: number, y: number): boolean => y <= 39;

describe('ProjectileWorld', () => {
  it('spawns an arrow with full def', () => {
    const w = new ProjectileWorld();
    const a = w.spawn('arrow', { x: 0, y: 50, z: 0 }, { x: 10, y: 0, z: 0 }, null);
    expect(a.def.kind).toBe('arrow');
    expect(a.def.damage).toBe(2);
    expect(w.size).toBe(1);
  });

  it('arrow falls under gravity over time', () => {
    const w = new ProjectileWorld();
    const a = w.spawn('arrow', { x: 0, y: 50, z: 0 }, { x: 5, y: 0, z: 0 }, null);
    for (let i = 0; i < 20; i++) w.tick(1 / 20, { isSolid: noFloor });
    expect(a.position.y).toBeLessThan(50);
  });

  it('fireball has zero gravity', () => {
    const w = new ProjectileWorld();
    const f = w.spawn('fireball', { x: 0, y: 50, z: 0 }, { x: 5, y: 0, z: 0 }, null);
    for (let i = 0; i < 20; i++) w.tick(1 / 20, { isSolid: noFloor });
    expect(f.position.y).toBeCloseTo(50, 0);
  });

  it('arrow sticks on floor contact', () => {
    const w = new ProjectileWorld();
    w.spawn('arrow', { x: 0, y: 41, z: 0 }, { x: 0, y: -2, z: 0 }, null);
    let stuck = false;
    for (let i = 0; i < 60; i++) {
      const r = w.tick(1 / 20, { isSolid: floorAtY40 });
      if (r.some((x) => x.hitBlock)) stuck = true;
    }
    expect(stuck).toBe(true);
  });

  it('snowball has short lifetime and expires', () => {
    const w = new ProjectileWorld();
    w.spawn('snowball', { x: 0, y: 50, z: 0 }, { x: 0, y: 0, z: 0 }, null);
    for (let i = 0; i < 400; i++) w.tick(1 / 20, { isSolid: noFloor });
    expect(w.size).toBe(0);
  });

  it('entity hit callback receives the projectile', () => {
    const w = new ProjectileWorld();
    w.spawn('arrow', { x: 0, y: 50, z: 0 }, { x: 5, y: 0, z: 0 }, null);
    let hits = 0;
    w.tick(1 / 20, {
      isSolid: noFloor,
      hitEntity: () => {
        hits++;
        return { entityId: 42, hitPoint: { x: 0, y: 50, z: 0 } };
      },
    });
    expect(hits).toBeGreaterThan(0);
  });

  it('remove clears the projectile', () => {
    const w = new ProjectileWorld();
    const a = w.spawn('arrow', { x: 0, y: 50, z: 0 }, { x: 5, y: 0, z: 0 }, null);
    w.remove(a.id);
    expect(w.size).toBe(0);
  });
});
