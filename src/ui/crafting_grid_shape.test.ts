import { describe, it, expect } from 'vitest';
import { matchesShaped, matchesShapeless } from './crafting_grid_shape';

describe('crafting grid shape', () => {
  it('shaped match', () => {
    expect(
      matchesShaped(
        { type: 'shaped', pattern: ['SS', 'S '], result: 'something' },
        [
          ['S', 'S'],
          ['S', ''],
        ],
      ),
    ).toBe(true);
  });

  it('shaped mismatch', () => {
    expect(
      matchesShaped(
        { type: 'shaped', pattern: ['SS', 'S '], result: 'x' },
        [
          ['S', ''],
          ['S', 'S'],
        ],
      ),
    ).toBe(false);
  });

  it('shapeless match', () => {
    expect(
      matchesShapeless(
        { type: 'shapeless', ingredients: ['apple', 'gold'], result: 'golden_apple' },
        ['gold', 'apple'],
      ),
    ).toBe(true);
  });

  it('shapeless differs', () => {
    expect(
      matchesShapeless(
        { type: 'shapeless', ingredients: ['apple', 'gold'], result: 'x' },
        ['apple'],
      ),
    ).toBe(false);
  });
});
