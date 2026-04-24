import { describe, it, expect } from 'vitest';
import {
  frictionFor,
  slipperyCount,
  DEFAULT_FRICTION,
  ICE_FRICTION,
  BLUE_ICE_FRICTION,
} from './ice_slip_friction';

describe('ice slip friction', () => {
  it('default dirt', () => {
    expect(frictionFor('dirt')).toBe(DEFAULT_FRICTION);
  });

  it('ice is slippery', () => {
    expect(frictionFor('ice')).toBe(ICE_FRICTION);
  });

  it('blue ice slickest', () => {
    expect(frictionFor('blue_ice')).toBe(BLUE_ICE_FRICTION);
  });

  it('honey sticks', () => {
    expect(frictionFor('honey_block')).toBeLessThan(DEFAULT_FRICTION);
  });

  it('ice counts as slippery', () => {
    expect(slipperyCount('ice')).toBe(true);
  });

  it('stone not slippery', () => {
    expect(slipperyCount('stone')).toBe(false);
  });

  it('soul sand drags', () => {
    expect(frictionFor('soul_sand')).toBeLessThan(DEFAULT_FRICTION);
  });
});
