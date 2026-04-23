import { describe, it, expect } from 'vitest';
import { canApply, consumesTemplate } from './loom_banner_pattern';

describe('loom banner pattern', () => {
  it('basic pattern works', () => {
    expect(canApply({ bannerBaseColor: 'white', dyeColor: 'red', pattern: 'cross' })).toBe(true);
  });

  it('no dye fails', () => {
    expect(canApply({ bannerBaseColor: 'white', pattern: 'cross' })).toBe(false);
  });

  it('special template works', () => {
    expect(
      canApply({ bannerBaseColor: 'white', dyeColor: 'red', specialTemplate: 'creeper' }),
    ).toBe(true);
  });

  it('unknown template fails', () => {
    expect(
      canApply({ bannerBaseColor: 'white', dyeColor: 'red', specialTemplate: 'xyz' }),
    ).toBe(false);
  });

  it('template consumed', () => {
    expect(consumesTemplate()).toBe(true);
  });
});
