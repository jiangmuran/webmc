import { describe, it, expect } from 'vitest';
import { filter, sortByName, type RecipeEntry } from './recipe_filter';

const all: RecipeEntry[] = [
  { id: 'a', name: 'Torch', category: 'misc', unlocked: true },
  { id: 'b', name: 'Iron Sword', category: 'equipment', unlocked: true },
  { id: 'c', name: 'Piston', category: 'redstone', unlocked: false },
];

describe('recipe filter', () => {
  it('hides locked by default', () => {
    expect(filter(all, { query: '', category: 'all', showLocked: false })).toHaveLength(2);
  });

  it('shows locked when requested', () => {
    expect(filter(all, { query: '', category: 'all', showLocked: true })).toHaveLength(3);
  });

  it('filters by category', () => {
    const r = filter(all, { query: '', category: 'equipment', showLocked: true });
    expect(r).toHaveLength(1);
    expect(r[0]?.id).toBe('b');
  });

  it('filters by query case-insensitive', () => {
    expect(filter(all, { query: 'iron', category: 'all', showLocked: true })).toHaveLength(1);
  });

  it('sort by name', () => {
    expect(sortByName(all).map((e) => e.name)).toEqual(['Iron Sword', 'Piston', 'Torch']);
  });
});
