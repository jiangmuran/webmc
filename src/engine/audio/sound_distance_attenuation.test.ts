import { describe, it, expect } from 'vitest';
import { attenuation, shouldPlay, clampVolume } from './sound_distance_attenuation';

describe('sound distance attenuation', () => {
  it('center full volume', () => {
    expect(attenuation({ distance: 0, maxDistance: 16, volume: 1 })).toBe(1);
  });

  it('past max zero', () => {
    expect(attenuation({ distance: 16, maxDistance: 16, volume: 1 })).toBe(0);
  });

  it('mid quadratic falloff', () => {
    const v = attenuation({ distance: 8, maxDistance: 16, volume: 1 });
    expect(v).toBeCloseTo(0.25);
  });

  it('should play threshold', () => {
    expect(shouldPlay(0.01)).toBe(true);
    expect(shouldPlay(0.0001)).toBe(false);
  });

  it('clamp within range', () => {
    expect(clampVolume(2)).toBe(1);
    expect(clampVolume(-0.5)).toBe(0);
  });
});
