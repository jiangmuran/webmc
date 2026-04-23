import { describe, it, expect } from 'vitest';
import {
  breakSpeed,
  harvestLevel,
  dropsCobbleUnlessSilk,
  DEEPSLATE_HARDNESS,
} from './deepslate_tough_break';

describe('deepslate tough break', () => {
  it('needs pickaxe', () => {
    expect(breakSpeed(0)).toBe(0);
    expect(breakSpeed(3)).toBeGreaterThan(0);
  });

  it('requires stone+', () => {
    expect(harvestLevel()).toBeGreaterThanOrEqual(1);
  });

  it('silk preserves smooth', () => {
    expect(dropsCobbleUnlessSilk(true)).toBe('deepslate');
    expect(dropsCobbleUnlessSilk(false)).toBe('cobbled_deepslate');
  });

  it('harder than stone', () => {
    expect(DEEPSLATE_HARDNESS).toBeGreaterThan(1.5);
  });
});
