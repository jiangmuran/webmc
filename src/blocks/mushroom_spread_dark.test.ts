import { describe, it, expect } from 'vitest';
import {
  canStay,
  canSpread,
  bonemealGrowsHugeMushroom,
  MAX_NEIGHBORS_IN_AREA,
  type MushroomState,
} from './mushroom_spread_dark';

const dark: MushroomState = {
  lightLevel: 5,
  blockAboveSolid: false,
  nearbyMushroomsInArea: 1,
  onMycelium: false,
};

describe('mushroom spread dark', () => {
  it('dark survives', () => {
    expect(canStay(dark)).toBe(true);
  });

  it('bright dies unless mycelium', () => {
    expect(canStay({ ...dark, lightLevel: 15 })).toBe(false);
    expect(canStay({ ...dark, lightLevel: 15, onMycelium: true })).toBe(true);
  });

  it('spreads lucky + dark', () => {
    expect(canSpread(dark, () => 0.01)).toBe(true);
  });

  it('too dense no spread', () => {
    expect(canSpread({ ...dark, nearbyMushroomsInArea: MAX_NEIGHBORS_IN_AREA }, () => 0.001)).toBe(
      false,
    );
  });

  it('bonemeal huge mushroom', () => {
    expect(bonemealGrowsHugeMushroom(dark, true)).toBe(true);
  });

  it('blocked above no huge', () => {
    expect(bonemealGrowsHugeMushroom({ ...dark, blockAboveSolid: true }, true)).toBe(false);
  });
});
