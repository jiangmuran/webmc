import { describe, it, expect } from 'vitest';
import { spawnsEntityType, isSpawnEgg, suppressedInDimension } from './spawn_egg_mob_from_id';

describe('spawn egg mob from id', () => {
  it('zombie egg', () => {
    expect(spawnsEntityType('zombie_spawn_egg')).toBe('zombie');
  });

  it('non-egg', () => {
    expect(spawnsEntityType('stick')).toBeUndefined();
  });

  it('isSpawnEgg', () => {
    expect(isSpawnEgg('creeper_spawn_egg')).toBe(true);
    expect(isSpawnEgg('sword')).toBe(false);
  });

  it('nether blocks snow golem', () => {
    expect(suppressedInDimension('snow_golem', 'nether')).toBe(true);
  });
});
