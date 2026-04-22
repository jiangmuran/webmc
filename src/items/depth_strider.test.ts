import { describe, it, expect } from 'vitest';
import { speedMultiplier, incompatibleWith } from './depth_strider';

describe('depth strider', () => {
  it('level 0 baseline', () => {
    expect(speedMultiplier(0)).toBeCloseTo(0.5);
  });

  it('level 3 full speed', () => {
    expect(speedMultiplier(3)).toBeCloseTo(1);
  });

  it('clamps above max', () => {
    expect(speedMultiplier(5)).toBe(speedMultiplier(3));
  });

  it('incompat frost_walker', () => {
    expect(incompatibleWith()).toContain('frost_walker');
  });
});
