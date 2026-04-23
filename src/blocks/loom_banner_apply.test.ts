import { describe, it, expect } from 'vitest';
import {
  canApply,
  consumesPatternItem,
  outputPatternCount,
  LOOM_PATTERN_CAP,
} from './loom_banner_apply';

describe('loom banner apply', () => {
  it('apply requires dye', () => {
    expect(canApply({ bannerPatterns: 0, dye: 'red', patternItem: null })).toBe(true);
    expect(canApply({ bannerPatterns: 0, dye: null, patternItem: null })).toBe(false);
  });

  it('reject at cap', () => {
    expect(canApply({ bannerPatterns: LOOM_PATTERN_CAP, dye: 'red', patternItem: null })).toBe(
      false,
    );
  });

  it('banner pattern item not consumed', () => {
    expect(consumesPatternItem('banner_pattern_mojang')).toBe(false);
  });

  it('no pattern item no consume', () => {
    expect(consumesPatternItem(null)).toBe(false);
  });

  it('count increments', () => {
    expect(outputPatternCount(3)).toBe(4);
    expect(outputPatternCount(6)).toBe(6);
  });
});
