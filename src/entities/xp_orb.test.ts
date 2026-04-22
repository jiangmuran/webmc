import { describe, it, expect } from 'vitest';
import { XpOrbWorld } from './xp_orb';

describe('XpOrbWorld', () => {
  it('drop splits total XP into multiple orbs when large', () => {
    const w = new XpOrbWorld();
    const orbs = w.drop(100, { x: 0, y: 0, z: 0 });
    expect(orbs.length).toBeGreaterThan(1);
    const sum = orbs.reduce((s, o) => s + o.value, 0);
    expect(sum).toBe(100);
  });

  it('drop of small total yields one orb', () => {
    const w = new XpOrbWorld();
    const orbs = w.drop(1, { x: 0, y: 0, z: 0 });
    expect(orbs.length).toBe(1);
    expect(orbs[0]?.value).toBe(1);
  });

  it('player pickup adds XP and removes the orb', () => {
    const w = new XpOrbWorld();
    w.drop(3, { x: 0, y: 50, z: 0 });
    let gained = 0;
    w.tick(0.05, {
      playerPos: { x: 0, y: 50, z: 0 },
      addXP: (v) => (gained += v),
    });
    expect(gained).toBeGreaterThan(0);
    expect(w.size).toBe(0);
  });

  it('magnet pulls orbs within 6 blocks', () => {
    const w = new XpOrbWorld();
    w.drop(1, { x: 5, y: 50, z: 0 });
    const orb = Array.from(w.all())[0];
    if (!orb) throw new Error();
    const before = { ...orb.position };
    for (let i = 0; i < 5; i++) {
      w.tick(1 / 20, {
        playerPos: { x: 0, y: 50, z: 0 },
        addXP: () => undefined,
      });
    }
    expect(orb.position.x).toBeLessThan(before.x);
  });

  it('far-away orb is not magneted', () => {
    const w = new XpOrbWorld();
    w.drop(1, { x: 50, y: 10, z: 0 });
    const orb = Array.from(w.all())[0];
    if (!orb) throw new Error();
    for (let i = 0; i < 5; i++) {
      w.tick(1 / 20, {
        playerPos: { x: 0, y: 50, z: 0 },
        addXP: () => undefined,
      });
    }
    expect(orb.position.x).toBeGreaterThan(40); // still drifting away with gravity
  });
});
