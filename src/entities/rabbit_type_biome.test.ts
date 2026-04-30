import { describe, it, expect } from 'vitest';
import {
  rollRabbitType,
  rollKillerBunny,
  canBreedWith,
  KILLER_SPAWN_CHANCE,
} from './rabbit_type_biome';

describe('rabbit variants', () => {
  it('snowy biomes white', () => {
    expect(rollRabbitType({ biome: 'snowy_plains', rand: () => 0.1 })).toBe('white');
  });

  it('desert gold', () => {
    expect(rollRabbitType({ biome: 'desert', rand: () => 0.5 })).toBe('gold');
  });

  it('flower forest salt', () => {
    expect(rollRabbitType({ biome: 'flower_forest', rand: () => 0.5 })).toBe('salt');
  });

  it('generic biome mix', () => {
    const types = new Set<string>();
    for (let i = 0; i < 20; i++) types.add(rollRabbitType({ biome: 'plains', rand: () => i / 20 }));
    expect(types.size).toBeGreaterThan(1);
  });

  it('killer bunny does NOT spawn naturally (wiki: command-only)', () => {
    expect(rollKillerBunny(() => 0)).toBe(false);
    expect(rollKillerBunny(() => 0.5)).toBe(false);
    expect(rollKillerBunny(() => 0.99999)).toBe(false);
    expect(KILLER_SPAWN_CHANCE).toBe(0);
  });

  it('breed food', () => {
    expect(canBreedWith('webmc:carrot')).toBe(true);
    expect(canBreedWith('webmc:stone')).toBe(false);
  });
});
