import { describe, it, expect } from 'vitest';
import {
  applyPattern,
  copyToBanner,
  hashLayers,
  isOminousBannerPattern,
  MAX_LAYERS,
  type BannerLayer,
} from './banner_pattern_layering';

describe('banner pattern layering', () => {
  it('add layer', () => {
    expect(applyPattern([], 'stripe_top', 'red')).toHaveLength(1);
  });

  it('max layers enforced', () => {
    const full: BannerLayer[] = Array.from({ length: MAX_LAYERS }, () => ({
      pattern: 'x',
      color: 'white',
    }));
    expect(applyPattern(full, 'y', 'red')).toHaveLength(MAX_LAYERS);
  });

  it('copy only fills empty', () => {
    const source: BannerLayer[] = [{ pattern: 'p', color: 'red' }];
    expect(copyToBanner(source, [])).toEqual(source);
  });

  it('copy preserves target if filled', () => {
    const source: BannerLayer[] = [{ pattern: 'p', color: 'red' }];
    const target: BannerLayer[] = [{ pattern: 'q', color: 'blue' }];
    expect(copyToBanner(source, target)).toEqual(target);
  });

  it('hash deterministic', () => {
    const layers: BannerLayer[] = [
      { pattern: 'a', color: 'red' },
      { pattern: 'b', color: 'blue' },
    ];
    expect(hashLayers(layers)).toBe(hashLayers(layers));
  });

  it('ominous pattern detected', () => {
    const o: BannerLayer[] = [
      { pattern: 'rhombus_middle', color: 'black' },
      { pattern: 'stripe_bottom', color: 'red' },
      { pattern: 'stripe_middle', color: 'gray' },
      { pattern: 'stripe_right', color: 'gray' },
      { pattern: 'stripe_left', color: 'gray' },
      { pattern: 'border', color: 'black' },
    ];
    expect(isOminousBannerPattern(o)).toBe(true);
  });
});
