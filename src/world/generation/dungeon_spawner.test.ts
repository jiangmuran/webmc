import { describe, it, expect } from 'vitest';
import { pickMob, chestsCount, MOB_WEIGHTS } from './dungeon_spawner';

describe('dungeon spawner', () => {
  it('lucky zombie', () => {
    expect(pickMob(() => 0)).toBe('zombie');
  });

  it('weights sum', () => {
    const total = Object.values(MOB_WEIGHTS).reduce((a, b) => a + b, 0);
    expect(total).toBe(100);
  });

  it('chest count up to 2', () => {
    expect(chestsCount(() => 0)).toBe(1);
    expect(chestsCount(() => 0.99)).toBe(0);
  });
});
