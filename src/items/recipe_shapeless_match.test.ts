import { describe, it, expect } from 'vitest';
import { matches, firstMatch, type ShapelessRecipe } from './recipe_shapeless_match';

const stew: ShapelessRecipe = {
  id: 'mushroom_stew',
  ingredients: ['brown_mushroom', 'red_mushroom', 'bowl'],
  result: { id: 'mushroom_stew', count: 1 },
};

describe('shapeless recipe match', () => {
  it('matches with air around', () => {
    expect(
      matches(stew, [
        'air',
        'brown_mushroom',
        'air',
        'red_mushroom',
        'air',
        'bowl',
        'air',
        'air',
        'air',
      ]),
    ).toBe(true);
  });

  it('missing ingredient', () => {
    expect(matches(stew, ['brown_mushroom', 'bowl', 'air'])).toBe(false);
  });

  it('extra ingredient fails', () => {
    expect(matches(stew, ['brown_mushroom', 'red_mushroom', 'bowl', 'dandelion'])).toBe(false);
  });

  it('firstMatch returns', () => {
    expect(firstMatch([stew], ['bowl', 'brown_mushroom', 'red_mushroom'])?.id).toBe(
      'mushroom_stew',
    );
  });

  it('firstMatch undefined if none', () => {
    expect(firstMatch([stew], ['stone'])).toBeUndefined();
  });
});
