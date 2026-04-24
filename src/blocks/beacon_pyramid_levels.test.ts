import { describe, it, expect } from 'vitest';
import {
  pyramidLevels,
  effectRange,
  secondaryAvailable,
  isValidBase,
} from './beacon_pyramid_levels';

describe('beacon pyramid levels', () => {
  it('level 4 full pyramid', () => {
    expect(pyramidLevels([9, 25, 49, 81])).toBe(4);
  });

  it('level 1 small pyramid', () => {
    expect(pyramidLevels([9])).toBe(1);
  });

  it('incomplete pyramid → 0', () => {
    expect(pyramidLevels([9, 10])).toBe(0);
  });

  it('range scales with tier', () => {
    expect(effectRange(1)).toBe(20);
    expect(effectRange(4)).toBe(50);
  });

  it('secondary only at tier 4', () => {
    expect(secondaryAvailable(4)).toBe(true);
    expect(secondaryAvailable(3)).toBe(false);
  });

  it('valid base recognized', () => {
    expect(isValidBase('diamond_block')).toBe(true);
    expect(isValidBase('dirt')).toBe(false);
  });
});
