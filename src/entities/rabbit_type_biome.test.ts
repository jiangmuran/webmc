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

  it('flower forest uses standard non-snowy mix (no special case)', () => {
    // r=0.49 → brown; r=0.6 → salt; r=0.95 → black.
    expect(rollRabbitType({ biome: 'flower_forest', rand: () => 0.49 })).toBe('brown');
    expect(rollRabbitType({ biome: 'flower_forest', rand: () => 0.6 })).toBe('salt');
    expect(rollRabbitType({ biome: 'flower_forest', rand: () => 0.95 })).toBe('black');
  });

  it('non-snowy biome mix is 50% brown / 40% salt / 10% black (wiki)', () => {
    expect(rollRabbitType({ biome: 'plains', rand: () => 0.49 })).toBe('brown');
    expect(rollRabbitType({ biome: 'plains', rand: () => 0.5 })).toBe('salt');
    expect(rollRabbitType({ biome: 'plains', rand: () => 0.89 })).toBe('salt');
    expect(rollRabbitType({ biome: 'plains', rand: () => 0.9 })).toBe('black');
  });

  it('non-snowy biomes never produce black_white (wiki)', () => {
    for (let i = 0; i < 100; i++) {
      const t = rollRabbitType({ biome: 'plains', rand: () => i / 100 });
      expect(t).not.toBe('black_white');
    }
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
