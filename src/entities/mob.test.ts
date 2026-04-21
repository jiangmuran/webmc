import { describe, it, expect } from 'vitest';
import { MobWorld } from './mob';

function floorAtY40(x: number, y: number, z: number): boolean {
  void x;
  void z;
  return y <= 39;
}

describe('MobWorld', () => {
  it('spawns mobs with full health from the def', () => {
    const m = new MobWorld();
    const zombie = m.spawn('zombie', { x: 0, y: 50, z: 0 });
    expect(zombie.health).toBe(20);
    expect(m.size).toBe(1);
  });

  it('gravity pulls mobs down to the floor', () => {
    const m = new MobWorld();
    const pig = m.spawn('pig', { x: 0.5, y: 50, z: 0.5 });
    for (let i = 0; i < 60; i++) {
      m.tick(1 / 20, { isSolid: floorAtY40, playerPos: null, damagePlayer: () => undefined });
    }
    expect(pig.onGround).toBe(true);
    expect(pig.position.y).toBeLessThan(45);
  });

  it('hostile mobs chase the player when within aggro range', () => {
    const m = new MobWorld();
    const z = m.spawn('zombie', { x: 10, y: 40.9, z: 0.5 });
    for (let i = 0; i < 80; i++) {
      m.tick(1 / 20, {
        isSolid: floorAtY40,
        playerPos: { x: 0, y: 40.9, z: 0 },
        damagePlayer: () => undefined,
      });
    }
    expect(z.position.x).toBeLessThan(10);
  });

  it('hostile mob damages player when in attack range', () => {
    const m = new MobWorld();
    m.spawn('zombie', { x: 0.5, y: 40.9, z: 0.5 });
    let totalDamage = 0;
    for (let i = 0; i < 40; i++) {
      m.tick(1 / 20, {
        isSolid: floorAtY40,
        playerPos: { x: 0.5, y: 40.9, z: 0.5 },
        damagePlayer: (amt) => (totalDamage += amt),
      });
    }
    expect(totalDamage).toBeGreaterThan(0);
  });

  it('damage removes mob when health ≤ 0', () => {
    const m = new MobWorld();
    const pig = m.spawn('pig', { x: 0, y: 50, z: 0 });
    m.damage(pig.id, 20);
    expect(m.size).toBe(0);
  });

  it('passive mobs do not chase the player', () => {
    const m = new MobWorld();
    const pig = m.spawn('pig', { x: 10, y: 40.9, z: 0.5 });
    const startX = pig.position.x;
    for (let i = 0; i < 40; i++) {
      m.tick(1 / 20, {
        isSolid: floorAtY40,
        playerPos: { x: 0, y: 40.9, z: 0 },
        damagePlayer: () => undefined,
      });
    }
    expect(pig.position.x).toBeCloseTo(startX, 0);
  });
});
