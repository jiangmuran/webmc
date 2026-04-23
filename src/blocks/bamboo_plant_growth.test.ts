import { describe, it, expect } from 'vitest';
import {
  stageForHeight,
  growChance,
  bonemealGrowth,
  MAX_HEIGHT,
  LARGE_STAGE_AT,
} from './bamboo_plant_growth';

describe('bamboo growth', () => {
  it('top is sapling', () => {
    expect(stageForHeight(5, 5)).toBe('sapling');
  });

  it('large stage on mature column', () => {
    expect(stageForHeight(0, LARGE_STAGE_AT)).toBe('large');
  });

  it('small stage on medium column', () => {
    expect(stageForHeight(3, 5)).toBe('small');
  });

  it('max height no grow', () => {
    expect(growChance({ totalHeight: MAX_HEIGHT, ageBoost: true }, () => 0)).toBe(false);
  });

  it('boost increases chance', () => {
    expect(growChance({ totalHeight: 3, ageBoost: true }, () => 0.2)).toBe(true);
    expect(growChance({ totalHeight: 3, ageBoost: false }, () => 0.2)).toBe(false);
  });

  it('bonemeal adds up to 2', () => {
    expect(bonemealGrowth({ totalHeight: 0, ageBoost: false })).toBe(2);
  });

  it('bonemeal caps at remaining', () => {
    expect(bonemealGrowth({ totalHeight: MAX_HEIGHT - 1, ageBoost: false })).toBe(1);
  });
});
