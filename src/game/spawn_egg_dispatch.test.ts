import { describe, it, expect } from 'vitest';
import { entityFromSpawnEgg, isSpawnEgg } from './spawn_egg_dispatch';

describe('spawn egg dispatch', () => {
  it('zombie egg resolves', () => {
    expect(entityFromSpawnEgg('zombie_spawn_egg')).toBe('zombie');
  });

  it('unknown egg undefined', () => {
    expect(entityFromSpawnEgg('fake_egg')).toBeUndefined();
  });

  it('isSpawnEgg by suffix', () => {
    expect(isSpawnEgg('allay_spawn_egg')).toBe(true);
    expect(isSpawnEgg('stone')).toBe(false);
  });

  it('warden egg resolves', () => {
    expect(entityFromSpawnEgg('warden_spawn_egg')).toBe('warden');
  });

  it('newest mobs resolve', () => {
    expect(entityFromSpawnEgg('creaking_spawn_egg')).toBe('creaking');
    expect(entityFromSpawnEgg('armadillo_spawn_egg')).toBe('armadillo');
  });
});
