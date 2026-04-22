import { describe, it, expect } from 'vitest';
import {
  boost,
  isBoosting,
  pigSpeed,
  isValidRecipe,
  BOOST_DURATION_MS,
  MAX_DURABILITY,
} from './carrot_on_stick_pig';

describe('carrot on stick', () => {
  it('boost once', () => {
    const i = { durability: MAX_DURABILITY, boostEndMs: 0 };
    expect(boost(i, 0)).toBe(true);
    expect(isBoosting(i, 1000)).toBe(true);
    expect(isBoosting(i, BOOST_DURATION_MS + 1)).toBe(false);
  });

  it('cannot boost at 0', () => {
    const i = { durability: 0, boostEndMs: 0 };
    expect(boost(i, 0)).toBe(false);
  });

  it('speed increases while boosting', () => {
    const i = { durability: MAX_DURABILITY, boostEndMs: 0 };
    boost(i, 0);
    expect(pigSpeed(i, 1000)).toBeGreaterThan(pigSpeed(i, BOOST_DURATION_MS + 100));
  });

  it('recipe check', () => {
    expect(isValidRecipe(true, true)).toBe(true);
    expect(isValidRecipe(true, false)).toBe(false);
  });
});
