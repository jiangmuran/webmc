import { describe, it, expect } from 'vitest';
import {
  boost,
  isBoosting,
  pigSpeed,
  pigBaseSpeed,
  isValidRecipe,
  BOOST_DURATION_MS,
  BOOST_MULTIPLIER,
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

  it('boost is 1.5× base ≈ 0.338 (wiki)', () => {
    const i = { durability: MAX_DURABILITY, boostEndMs: 0 };
    boost(i, 0);
    expect(BOOST_MULTIPLIER).toBe(1.5);
    expect(pigSpeed(i, 100)).toBeCloseTo(0.225 * 1.5, 5);
    expect(pigSpeed(i, 100)).toBeCloseTo(0.338, 2);
  });

  it('boost lasts 2 seconds (wiki)', () => {
    expect(BOOST_DURATION_MS).toBe(2000);
  });

  it('base speed 0.225', () => {
    expect(pigBaseSpeed()).toBe(0.225);
  });

  it('recipe check', () => {
    expect(isValidRecipe(true, true)).toBe(true);
    expect(isValidRecipe(true, false)).toBe(false);
  });
});
