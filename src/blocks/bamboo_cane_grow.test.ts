import { describe, it, expect } from 'vitest';
import { canGrowOn, tryGrow, topVariant, MAX_HEIGHT, MATURE_HEIGHT } from './bamboo_cane_grow';

describe('bamboo', () => {
  it('valid ground', () => {
    expect(canGrowOn('webmc:sand')).toBe(true);
    expect(canGrowOn('webmc:stone')).toBe(false);
  });

  it('young does not grow naturally', () => {
    expect(tryGrow({ currentHeight: 1, age: 0, rand: () => 0, boneMealed: false }).grew).toBe(
      false,
    );
  });

  it('mature grows on chance', () => {
    expect(tryGrow({ currentHeight: 2, age: 1, rand: () => 0, boneMealed: false }).grew).toBe(true);
  });

  it('bone meal force-grows', () => {
    expect(tryGrow({ currentHeight: 1, age: 0, rand: () => 0.99, boneMealed: true }).grew).toBe(
      true,
    );
  });

  it('capped at MAX_HEIGHT', () => {
    expect(
      tryGrow({ currentHeight: MAX_HEIGHT, age: 1, rand: () => 0, boneMealed: true }).grew,
    ).toBe(false);
  });

  it('top variant progression', () => {
    expect(topVariant(1)).toBe('none');
    expect(topVariant(MATURE_HEIGHT)).toBe('small_leaves');
    expect(topVariant(10)).toBe('large_leaves');
  });
});
