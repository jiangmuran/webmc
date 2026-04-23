import { describe, it, expect } from 'vitest';
import { tabItems, searchItems, TABS_ORDER } from './creative_tabs';

const items = [
  { id: 'stone', tab: 'building_blocks' as const, order: 1 },
  { id: 'dirt', tab: 'building_blocks' as const, order: 2 },
  { id: 'sword', tab: 'combat' as const, order: 1 },
];

describe('creative tabs', () => {
  it('tab filters + sorts', () => {
    const r = tabItems(items, 'building_blocks');
    expect(r.map((i) => i.id)).toEqual(['stone', 'dirt']);
  });

  it('search case-insensitive', () => {
    expect(searchItems(items, 'STO').map((i) => i.id)).toEqual(['stone']);
  });

  it('empty query returns all', () => {
    expect(searchItems(items, '').length).toBe(3);
  });

  it('11 tabs', () => {
    expect(TABS_ORDER.length).toBe(11);
  });
});
