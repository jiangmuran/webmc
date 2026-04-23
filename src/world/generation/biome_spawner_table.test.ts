import { describe, it, expect } from 'vitest';
import { spawnersFor, totalWeight } from './biome_spawner_table';

describe('biome spawner table', () => {
  it('plains has multiple mobs', () => {
    expect(spawnersFor('plains').length).toBeGreaterThan(1);
  });

  it('unknown biome empty', () => {
    expect(spawnersFor('ocean_void')).toEqual([]);
  });

  it('total weight sums entries', () => {
    expect(totalWeight('plains')).toBeGreaterThan(0);
  });

  it('nether heavy on pigmen', () => {
    const piglin = spawnersFor('nether_wastes').find((e) => e.mob === 'zombified_piglin');
    expect(piglin?.weight).toBeGreaterThan(50);
  });
});
