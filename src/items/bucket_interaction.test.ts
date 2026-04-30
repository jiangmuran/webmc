import { describe, it, expect } from 'vitest';
import {
  canPickUpWater,
  onRightClickOnWater,
  onRightClickOnLava,
  returnsEmptyAfterPlacement,
} from './bucket_interaction';

describe('bucket interaction', () => {
  it('empty picks water', () => {
    expect(canPickUpWater('empty')).toBe(true);
    expect(onRightClickOnWater('empty')).toBe('water');
  });

  it('full unchanged', () => {
    expect(onRightClickOnWater('water')).toBe('water');
  });

  it('lava pickup', () => {
    expect(onRightClickOnLava('empty')).toBe('lava');
  });

  it('place returns empty', () => {
    expect(returnsEmptyAfterPlacement('water')).toBe(true);
    expect(returnsEmptyAfterPlacement('lava')).toBe(true);
    expect(returnsEmptyAfterPlacement('powder_snow')).toBe(true);
    expect(returnsEmptyAfterPlacement('fish')).toBe(true);
    expect(returnsEmptyAfterPlacement('axolotl')).toBe(true);
    expect(returnsEmptyAfterPlacement('milk')).toBe(false);
  });
});
