import { describe, it, expect } from 'vitest';
import { matches } from './crafting_shapeless';

const dye = {
  ingredients: ['white_dye', 'red_dye'],
  result: { id: 'pink_dye', count: 2 },
};

describe('crafting shapeless', () => {
  it('matches any order', () => {
    expect(matches(dye, ['white_dye', 'red_dye', null])).toBe(true);
    expect(matches(dye, ['red_dye', null, 'white_dye'])).toBe(true);
  });

  it('rejects extra', () => {
    expect(matches(dye, ['white_dye', 'red_dye', 'blue_dye'])).toBe(false);
  });

  it('rejects missing', () => {
    expect(matches(dye, ['white_dye', null, null])).toBe(false);
  });

  it('rejects wrong', () => {
    expect(matches(dye, ['white_dye', 'blue_dye', null])).toBe(false);
  });
});
