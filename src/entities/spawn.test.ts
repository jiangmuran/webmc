import { describe, it, expect } from 'vitest';
import { MobWorld } from './mob';
import { SpawnSystem } from './spawn';

function ctx(isDay: boolean, rngSeed = 0.5): Parameters<SpawnSystem['tick']>[2] {
  let k = rngSeed;
  const rng = (): number => {
    k = (k * 9301 + 49297) % 233280;
    return k / 233280;
  };
  return {
    playerPos: { x: 0, y: 64, z: 0 },
    isDay,
    surfaceAt: () => 63,
    isSolid: () => false,
    rng,
  };
}

describe('SpawnSystem', () => {
  it('spawns hostile mobs at night', () => {
    const mobs = new MobWorld();
    const s = new SpawnSystem({ checkIntervalSec: 0.1, maxHostile: 4 });
    for (let i = 0; i < 20; i++) s.tick(0.5, mobs, ctx(false));
    expect(mobs.size).toBeGreaterThan(0);
    for (const m of mobs.all()) expect(m.def.hostile).toBe(true);
  });

  it('spawns passive mobs during the day', () => {
    const mobs = new MobWorld();
    const s = new SpawnSystem({ checkIntervalSec: 0.1, maxPassive: 3 });
    for (let i = 0; i < 20; i++) s.tick(0.5, mobs, ctx(true));
    for (const m of mobs.all()) expect(m.def.hostile).toBe(false);
  });

  it('respects per-category caps', () => {
    const mobs = new MobWorld();
    const s = new SpawnSystem({ checkIntervalSec: 0.1, maxHostile: 2, maxPassive: 0 });
    for (let i = 0; i < 50; i++) s.tick(0.5, mobs, ctx(false));
    expect(mobs.size).toBeLessThanOrEqual(2);
  });

  it('despawns mobs far from the player', () => {
    const mobs = new MobWorld();
    const s = new SpawnSystem({ checkIntervalSec: 0.05 });
    const far = mobs.spawn('pig', { x: 500, y: 64, z: 500 });
    s.tick(1, mobs, {
      playerPos: { x: 0, y: 64, z: 0 },
      isDay: true,
      surfaceAt: () => 63,
      isSolid: () => true, // can't spawn new mobs so the test only measures despawn
    });
    expect(mobs.size).toBe(0);
    void far;
  });

  it('does nothing if checkIntervalSec has not elapsed', () => {
    const mobs = new MobWorld();
    const s = new SpawnSystem({ checkIntervalSec: 10 });
    s.tick(1, mobs, ctx(false));
    expect(mobs.size).toBe(0);
  });
});
