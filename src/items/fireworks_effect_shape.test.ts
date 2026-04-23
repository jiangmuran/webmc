import { describe, it, expect } from 'vitest';
import { valid, starCountForFlightLevel } from './fireworks_effect_shape';

describe('fireworks effect shape', () => {
  it('has colors = valid', () => {
    expect(
      valid({
        shape: 'small_ball',
        colors: ['red'],
        fadeColors: [],
        hasTrail: false,
        hasTwinkle: false,
      }),
    ).toBe(true);
  });

  it('no colors invalid', () => {
    expect(
      valid({
        shape: 'star',
        colors: [],
        fadeColors: [],
        hasTrail: false,
        hasTwinkle: false,
      }),
    ).toBe(false);
  });

  it('flight clamps', () => {
    expect(starCountForFlightLevel(0)).toBe(1);
    expect(starCountForFlightLevel(10)).toBe(3);
  });
});
