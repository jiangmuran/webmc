import { describe, it, expect } from 'vitest';
import { fovScale, smoothedFov } from './fov_effect_sprint';

describe('fov effect sprint', () => {
  it('sprint boosts FOV', () => {
    expect(fovScale(true, 0)).toBeGreaterThan(fovScale(false, 0));
  });

  it('speed effect stacks', () => {
    expect(fovScale(true, 3)).toBeGreaterThan(fovScale(true, 0));
  });

  it('idle is 1', () => {
    expect(fovScale(false, 0)).toBe(1);
  });

  it('smoothing interpolates', () => {
    expect(smoothedFov(1, 2, 0.5)).toBe(1.5);
  });
});
