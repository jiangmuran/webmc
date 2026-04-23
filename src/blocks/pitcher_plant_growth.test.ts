import { describe, it, expect } from 'vitest';
import { tryGrow, requiresUpperBlock, isMature, PITCHER_MAX_AGE } from './pitcher_plant_growth';

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
});
