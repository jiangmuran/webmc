import { describe, it, expect } from 'vitest';
import { makeComposter, tryAdd, harvest, addChanceFor } from './composter_level';

describe('composter', () => {
  it('add chance table', () => {
    expect(addChanceFor('webmc:cake')).toBe(1);
    expect(addChanceFor('webmc:wheat_seeds')).toBe(0.3);
    expect(addChanceFor('webmc:stone')).toBe(0);
  });

  it('guaranteed item always levels', () => {
    const c = makeComposter();
    for (let i = 0; i < 7; i++) {
      expect(tryAdd(c, { itemId: 'webmc:cake', rand: () => 0.99 })).toBe('leveled');
    }
    expect(c.level).toBe(7);
    expect(tryAdd(c, { itemId: 'webmc:cake', rand: () => 0 })).toBe('full');
  });

  it('random below chance levels', () => {
    const c = makeComposter();
    expect(tryAdd(c, { itemId: 'webmc:wheat_seeds', rand: () => 0.1 })).toBe('leveled');
    expect(tryAdd(c, { itemId: 'webmc:wheat_seeds', rand: () => 0.9 })).toBe('rejected');
  });

  it('non-compostable ignored', () => {
    const c = makeComposter();
    expect(tryAdd(c, { itemId: 'webmc:stone', rand: () => 0 })).toBe('ignored');
  });

  it('harvest at full, reset', () => {
    const c = { level: 7 };
    expect(harvest(c)).toBe('webmc:bone_meal');
    expect(c.level).toBe(0);
    expect(harvest(c)).toBeNull();
  });
});
