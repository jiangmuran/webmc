import { describe, it, expect } from 'vitest';
import { filterByTab, searchRecipes } from './recipe_book_search';

const recipes = [
  { resultId: 'iron_sword', tags: ['weapon'], tabs: ['equipment'] },
  { resultId: 'bread', tags: ['food'], tabs: ['food'] },
  { resultId: 'oak_planks', tags: ['wood'], tabs: ['building'] },
];

describe('recipe book search', () => {
  it('all returns everything', () => {
    expect(filterByTab(recipes, 'all')).toHaveLength(3);
  });

  it('equipment tab', () => {
    expect(filterByTab(recipes, 'equipment')).toHaveLength(1);
  });

  it('search by result', () => {
    expect(searchRecipes(recipes, 'sword')).toHaveLength(1);
  });

  it('empty query all', () => {
    expect(searchRecipes(recipes, '')).toHaveLength(3);
  });

  it('tag match', () => {
    expect(searchRecipes(recipes, 'wood')).toHaveLength(1);
  });
});
