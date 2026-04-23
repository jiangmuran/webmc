import { describe, it, expect } from 'vitest';
import { canGenerate, lootTable, drownedSpawnWeight } from './ocean_ruin_spawn';

describe('ocean ruin spawn', () => {
  it('lucky roll in ocean', () => {
    expect(canGenerate(true, () => 0)).toBe(true);
  });

  it('not in ocean no', () => {
    expect(canGenerate(false, () => 0)).toBe(false);
  });

  it('cold vs warm loot differ', () => {
    expect(lootTable('cold')).not.toEqual(lootTable('warm'));
  });

  it('drowned spawn positive', () => {
    expect(drownedSpawnWeight()).toBeGreaterThan(0);
  });
});
