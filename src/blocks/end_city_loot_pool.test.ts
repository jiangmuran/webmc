import { describe, it, expect } from 'vitest';
import { rollTable, END_CITY_TOWER_CHEST, END_CITY_SHIP_ELYTRA } from './end_city_loot_pool';

describe('end city loot', () => {
  it('rolls produce N items', () => {
    const r = rollTable({ table: END_CITY_TOWER_CHEST, rolls: 5, rand: () => 0.5 });
    expect(r.length).toBe(5);
  });

  it('deterministic', () => {
    const a = rollTable({ table: END_CITY_TOWER_CHEST, rolls: 3, rand: () => 0.1 });
    const b = rollTable({ table: END_CITY_TOWER_CHEST, rolls: 3, rand: () => 0.1 });
    expect(a).toEqual(b);
  });

  it('elytra constant', () => {
    expect(END_CITY_SHIP_ELYTRA.itemId).toBe('webmc:elytra');
  });

  it('counts within bounds', () => {
    const r = rollTable({ table: END_CITY_TOWER_CHEST, rolls: 50, rand: () => 0.3 });
    for (const e of r) {
      const def = END_CITY_TOWER_CHEST.find((x) => x.itemId === e.itemId);
      if (def) {
        expect(e.count).toBeGreaterThanOrEqual(def.minCount);
        expect(e.count).toBeLessThanOrEqual(def.maxCount);
      }
    }
  });
});
