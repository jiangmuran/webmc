import { describe, it, expect } from 'vitest';
import { maxLevel, isTreasure } from './enchant_max_level_table';

describe('enchant max level table', () => {
  it('sharpness max 5', () => {
    expect(maxLevel('sharpness')).toBe(5);
  });

  it('silk touch only 1', () => {
    expect(maxLevel('silk_touch')).toBe(1);
  });

  it('unknown undefined', () => {
    expect(maxLevel('unknown')).toBeUndefined();
  });

  it('mending is treasure', () => {
    expect(isTreasure('mending')).toBe(true);
  });

  it('sharpness not treasure', () => {
    expect(isTreasure('sharpness')).toBe(false);
  });

  it('curse of binding treasure', () => {
    expect(isTreasure('curse_of_binding')).toBe(true);
  });

  it('piercing max 4', () => {
    expect(maxLevel('piercing')).toBe(4);
  });
});
