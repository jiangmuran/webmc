import { describe, it, expect } from 'vitest';
import { shouldExtinguish, canSpreadTo, tickAge, MAX_AGE } from './fire_tick_spread';

describe('fire tick spread', () => {
  it('rain extinguishes', () => {
    expect(
      shouldExtinguish(
        { flammability: 5, encouragement: 0, age: 0, rain: true, humid: false },
        () => 0.5,
      ),
    ).toBe(true);
  });

  it('humid half-chance extinguish', () => {
    expect(
      shouldExtinguish(
        { flammability: 5, encouragement: 0, age: 0, rain: false, humid: true },
        () => 0.1,
      ),
    ).toBe(true);
  });

  it('dry stays', () => {
    expect(
      shouldExtinguish(
        { flammability: 5, encouragement: 0, age: 0, rain: false, humid: false },
        () => 0.5,
      ),
    ).toBe(false);
  });

  it('zero flammability no spread', () => {
    expect(canSpreadTo(0, 30, () => 0.01)).toBe(false);
  });

  it('wood spreads sometimes', () => {
    expect(canSpreadTo(20, 10, () => 0.01)).toBe(true);
  });

  it('age caps at MAX_AGE', () => {
    expect(tickAge(MAX_AGE, () => 0)).toBe(MAX_AGE);
  });

  it('age increments sometimes', () => {
    expect(tickAge(5, () => 0.01)).toBe(6);
  });
});
