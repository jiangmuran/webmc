import { describe, it, expect } from 'vitest';
import {
  canCraftArrows,
  arrowYield,
  canCraftSpectral,
  spectralYield,
} from './fletching_arrow_craft';

describe('fletching arrow craft', () => {
  it('needs 1 each', () => {
    expect(canCraftArrows({ flint: 1, stick: 1, feather: 1 })).toBe(true);
    expect(canCraftArrows({ flint: 0, stick: 1, feather: 1 })).toBe(false);
  });

  it('yields 4', () => {
    expect(arrowYield()).toBe(4);
  });

  it('spectral needs 4 + 1', () => {
    expect(canCraftSpectral(4, 1)).toBe(true);
    expect(canCraftSpectral(3, 1)).toBe(false);
  });

  it('spectral yields 2', () => {
    expect(spectralYield()).toBe(2);
  });
});
