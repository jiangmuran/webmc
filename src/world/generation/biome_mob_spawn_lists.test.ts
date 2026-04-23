import { describe, it, expect } from 'vitest';
import { mobsInBiome } from './biome_mob_spawn_lists';

describe('biome mob spawn lists', () => {
  it('plains has cows', () => {
    const p = mobsInBiome('plains', 'passive');
    expect(p.map((e) => e.id)).toContain('cow');
  });

  it('desert has husks', () => {
    const h = mobsInBiome('desert', 'hostile');
    expect(h.map((e) => e.id)).toContain('husk');
  });

  it('desert no passive cows', () => {
    const p = mobsInBiome('desert', 'passive');
    expect(p.map((e) => e.id)).not.toContain('cow');
  });

  it('unknown biome empty', () => {
    expect(mobsInBiome('nonexistent', 'passive')).toEqual([]);
  });

  it('bats ambient in plains', () => {
    expect(mobsInBiome('plains', 'ambient').map((e) => e.id)).toContain('bat');
  });
});
