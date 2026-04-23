import { describe, it, expect } from 'vitest';
import { fromNoise } from './continentalness_map';

describe('continentalness', () => {
  it('deep ocean at negative', () => {
    expect(fromNoise(-0.7)).toBe('deep_ocean');
  });

  it('coast near zero negative', () => {
    expect(fromNoise(-0.15)).toBe('coast');
  });

  it('mid inland', () => {
    expect(fromNoise(0.2)).toBe('mid_inland');
  });

  it('far inland top', () => {
    expect(fromNoise(1)).toBe('far_inland');
  });

  it('mushroom edge', () => {
    expect(fromNoise(-1.5)).toBe('mushroom_fields');
  });
});
