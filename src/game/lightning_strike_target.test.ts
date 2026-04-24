import { describe, it, expect } from 'vitest';
import {
  canStrikeHere,
  attractedToLightningRod,
  LIGHTNING_ROD_ATTRACTION_RADIUS,
} from './lightning_strike_target';

describe('lightning strike target', () => {
  it('no thunder no strike', () => {
    expect(
      canStrikeHere({
        isThundering: false,
        skyLight: 15,
        playerIsOutside: true,
        wearsLightningRod: false,
      }),
    ).toBe(false);
  });

  it('covered no strike', () => {
    expect(
      canStrikeHere({
        isThundering: true,
        skyLight: 5,
        playerIsOutside: false,
        wearsLightningRod: false,
      }),
    ).toBe(false);
  });

  it('open sky strikes', () => {
    expect(
      canStrikeHere({
        isThundering: true,
        skyLight: 15,
        playerIsOutside: true,
        wearsLightningRod: false,
      }),
    ).toBe(true);
  });

  it('lightning rod attracts', () => {
    expect(attractedToLightningRod(true, true)).toBe(true);
  });

  it('rod out of range', () => {
    expect(attractedToLightningRod(false, true)).toBe(false);
  });

  it('radius 128', () => {
    expect(LIGHTNING_ROD_ATTRACTION_RADIUS).toBe(128);
  });
});
