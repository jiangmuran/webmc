import { describe, it, expect } from 'vitest';
import { outlineColor, shouldRender, visibleThroughWalls } from './mob_glow_outline';

describe('glow outline', () => {
  it('team color wins', () => {
    expect(
      outlineColor({ fromSpectralArrow: true, fromStatusEffect: false, fromTeam: 'red' }),
    ).toBe('red');
  });

  it('default white', () => {
    expect(outlineColor({ fromSpectralArrow: false, fromStatusEffect: true, fromTeam: null })).toBe(
      'white',
    );
  });

  it('no sources = no render', () => {
    expect(
      shouldRender({ fromSpectralArrow: false, fromStatusEffect: false, fromTeam: null }),
    ).toBe(false);
  });

  it('visibility through walls', () => {
    expect(
      visibleThroughWalls({ fromSpectralArrow: true, fromStatusEffect: false, fromTeam: null }),
    ).toBe(true);
    expect(
      visibleThroughWalls({ fromSpectralArrow: false, fromStatusEffect: false, fromTeam: 'red' }),
    ).toBe(false);
  });
});
