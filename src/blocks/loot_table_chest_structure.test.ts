import { describe, it, expect } from 'vitest';
import {
  rollStructure,
  DUNGEON_CHEST,
  STRONGHOLD_LIBRARY_CHEST,
  DESERT_TEMPLE_CHEST,
} from './loot_table_chest_structure';

describe('structure loot', () => {
  it('dungeon rolls', () => {
    expect(rollStructure({ table: DUNGEON_CHEST, rolls: 3, rand: () => 0.5 }).length).toBe(3);
  });

  it('library has books', () => {
    expect(STRONGHOLD_LIBRARY_CHEST.find((e) => e.itemId === 'webmc:book')).toBeTruthy();
  });

  it('desert temple has treasure', () => {
    expect(DESERT_TEMPLE_CHEST.find((e) => e.itemId === 'webmc:diamond')).toBeTruthy();
  });

  it('deterministic', () => {
    const a = rollStructure({ table: DUNGEON_CHEST, rolls: 3, rand: () => 0.3 });
    const b = rollStructure({ table: DUNGEON_CHEST, rolls: 3, rand: () => 0.3 });
    expect(a).toEqual(b);
  });
});
