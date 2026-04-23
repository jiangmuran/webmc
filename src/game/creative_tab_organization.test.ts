import { describe, it, expect } from 'vitest';
import { itemsInTab, searchMatches, type Entry } from './creative_tab_organization';

const db: Entry[] = [
  { id: 'stone', tab: 'building_blocks', order: 0 },
  { id: 'cobblestone', tab: 'building_blocks', order: 1 },
  { id: 'diamond_sword', tab: 'combat', order: 0 },
  { id: 'apple', tab: 'food_and_drinks', order: 0 },
];

describe('creative tab organization', () => {
  it('building blocks filter', () => {
    expect(itemsInTab(db, 'building_blocks').map((e) => e.id)).toEqual(['stone', 'cobblestone']);
  });

  it('combat tab separate', () => {
    expect(itemsInTab(db, 'combat').map((e) => e.id)).toEqual(['diamond_sword']);
  });

  it('search matches substring', () => {
    expect(searchMatches(db, 'stone').map((e) => e.id)).toContain('cobblestone');
  });

  it('empty query no match', () => {
    expect(searchMatches(db, '')).toEqual([]);
  });

  it('case-insensitive', () => {
    expect(searchMatches(db, 'DIA').map((e) => e.id)).toEqual(['diamond_sword']);
  });
});
