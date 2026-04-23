import { describe, it, expect } from 'vitest';
import { rollMob, chestCount, dungeonLoot, DUNGEON_MOB_WEIGHTS } from './dungeon_spawner';

describe('dungeon spawner', () => {
  it('zombie most common', () => {
    expect(DUNGEON_MOB_WEIGHTS.zombie).toBeGreaterThanOrEqual(DUNGEON_MOB_WEIGHTS.skeleton);
  });

  it('roll returns known mob', () => {
    const mob = rollMob(Math.random);
    expect(['zombie', 'skeleton', 'spider']).toContain(mob);
  });

  it('chest count 1 or 2', () => {
    for (let i = 0; i < 10; i++) {
      const n = chestCount(Math.random);
      expect([1, 2]).toContain(n);
    }
  });

  it('loot is non-empty string', () => {
    expect(typeof dungeonLoot(Math.random)).toBe('string');
  });
});
