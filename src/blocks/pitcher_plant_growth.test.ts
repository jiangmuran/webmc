import { describe, it, expect } from 'vitest';
import {
  tryGrow,
  requiresUpperBlock,
  isMature,
  harvestYield,
  PITCHER_MAX_AGE,
} from './pitcher_plant_growth';

describe('pitcher plant growth', () => {
  it('grows on lucky roll', () => {
    expect(tryGrow({ age: 0, upperBlock: false }, () => 0).age).toBe(1);
  });

  it('caps at max', () => {
    expect(tryGrow({ age: PITCHER_MAX_AGE, upperBlock: true }, () => 0).age).toBe(PITCHER_MAX_AGE);
  });

  it('tall requirement at age 2+', () => {
    expect(requiresUpperBlock(1)).toBe(false);
    expect(requiresUpperBlock(2)).toBe(true);
  });

  it('mature flag', () => {
    expect(isMature({ age: PITCHER_MAX_AGE, upperBlock: true })).toBe(true);
    expect(isMature({ age: 1, upperBlock: false })).toBe(false);
  });

  it('mature pitcher crop drops 1 pitcher plant (wiki, deterministic)', () => {
    expect(harvestYield(PITCHER_MAX_AGE)).toBe(1);
  });

  it('immature pitcher crop drops the pitcher pod back (wiki, 1)', () => {
    expect(harvestYield(0)).toBe(1);
    expect(harvestYield(1)).toBe(1);
    expect(harvestYield(2)).toBe(1);
    expect(harvestYield(3)).toBe(1);
  });
});
