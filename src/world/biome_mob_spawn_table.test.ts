import { describe, it, expect } from 'vitest';
import { pickSpawn, poolOf } from './biome_mob_spawn_table';

describe('biome mob spawns', () => {
  it('plains has sheep + cow', () => {
    const pool = poolOf('plains', 'creature');
    const ids = pool.map((e) => e.mob);
    expect(ids).toContain('sheep');
    expect(ids).toContain('cow');
  });

  it('ocean has squid', () => {
    const pool = poolOf('ocean', 'water_creature');
    expect(pool.map((e) => e.mob)).toContain('squid');
  });

  it('nether has ghast', () => {
    const pool = poolOf('nether_wastes', 'monster');
    expect(pool.map((e) => e.mob)).toContain('ghast');
  });

  it('end has only endermen monsters', () => {
    const pool = poolOf('the_end', 'monster');
    expect(pool.map((e) => e.mob)).toEqual(['enderman']);
  });

  it('unknown biome = empty pool', () => {
    expect(poolOf('xyz', 'monster')).toEqual([]);
  });

  it('pickSpawn picks a valid entry', () => {
    const pick = pickSpawn('plains', 'monster', 0.001);
    expect(pick?.mob).toBe('zombie');
  });

  it('empty pool = null', () => {
    expect(pickSpawn('xyz', 'monster', 0.5)).toBeNull();
  });
});
