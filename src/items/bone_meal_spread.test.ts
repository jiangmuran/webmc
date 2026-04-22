import { describe, it, expect } from 'vitest';
import { boneMealGrass, flowerPoolFor } from './bone_meal_spread';

describe('bone meal spread', () => {
  it('places something on grass', () => {
    const events = boneMealGrass({
      center: { x: 0, y: 60, z: 0 },
      biome: 'plains',
      rng: () => 0.05,
      airAt: () => true,
      grassAt: () => true,
    });
    expect(events.length).toBeGreaterThan(0);
  });

  it('no grass = no events', () => {
    const events = boneMealGrass({
      center: { x: 0, y: 60, z: 0 },
      biome: 'plains',
      rng: () => 0.5,
      airAt: () => true,
      grassAt: () => false,
    });
    expect(events).toEqual([]);
  });

  it('swamp pool is only blue orchid', () => {
    expect(flowerPoolFor('swamp')).toEqual(['webmc:blue_orchid']);
  });

  it('flower forest has many flowers', () => {
    expect(flowerPoolFor('flower_forest').length).toBeGreaterThan(5);
  });

  it('unknown biome falls back to plains', () => {
    expect(flowerPoolFor('xyz')).toEqual(flowerPoolFor('plains'));
  });
});
