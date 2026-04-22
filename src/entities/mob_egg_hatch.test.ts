import { describe, it, expect } from 'vitest';
import { dispenserEggSpawn, eggToMobId, spawnEggFor, useSpawnEgg } from './mob_egg_hatch';

describe('mob spawn egg', () => {
  it('parses mob from egg id', () => {
    expect(eggToMobId('webmc:zombie_spawn_egg')).toBe('zombie');
    expect(eggToMobId('webmc:stone')).toBeNull();
  });

  it('constructs egg id', () => {
    expect(spawnEggFor('cow')).toBe('webmc:cow_spawn_egg');
  });

  it('wild use spawns mob', () => {
    const r = useSpawnEgg({
      eggItemId: 'webmc:cow_spawn_egg',
      spawnPos: { x: 0, y: 64, z: 0 },
      targetEntity: null,
      rng: () => 0.9,
    });
    if (r.kind !== 'spawn_mob') throw new Error();
    expect(r.mob).toBe('cow');
    expect(r.isBaby).toBe(false);
  });

  it('zombie rare baby', () => {
    const r = useSpawnEgg({
      eggItemId: 'webmc:zombie_spawn_egg',
      spawnPos: { x: 0, y: 64, z: 0 },
      targetEntity: null,
      rng: () => 0.01,
    });
    if (r.kind !== 'spawn_mob') throw new Error();
    expect(r.isBaby).toBe(true);
  });

  it('used on same-kind entity = baby', () => {
    const r = useSpawnEgg({
      eggItemId: 'webmc:cow_spawn_egg',
      spawnPos: { x: 0, y: 64, z: 0 },
      targetEntity: { id: 5, kind: 'cow' },
      rng: () => 0.5,
    });
    expect(r.kind).toBe('spawn_baby');
  });

  it('wrong target refused', () => {
    const r = useSpawnEgg({
      eggItemId: 'webmc:cow_spawn_egg',
      spawnPos: { x: 0, y: 64, z: 0 },
      targetEntity: { id: 5, kind: 'pig' },
      rng: () => 0.5,
    });
    expect(r.kind).toBe('refused');
  });

  it('dispenser always spawns adult', () => {
    const r = dispenserEggSpawn('webmc:zombie_spawn_egg', { x: 0, y: 64, z: 0 });
    expect(r?.isBaby).toBe(false);
  });
});
