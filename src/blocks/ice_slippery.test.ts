import { describe, it, expect } from 'vitest';
import { applyFriction, boatFrictionOf, frictionOf, speedCapMultiplier } from './ice_slippery';

describe('ice friction', () => {
  it('blue ice is the most slippery', () => {
    expect(frictionOf('blue_ice')).toBeGreaterThan(frictionOf('packed_ice'));
  });

  it('default is 0.6', () => {
    expect(frictionOf('default')).toBe(0.6);
  });

  it('soul sand is slow', () => {
    expect(frictionOf('soul_sand')).toBeLessThan(frictionOf('default'));
  });

  it('honey slows you down', () => {
    expect(frictionOf('honey_block')).toBeLessThan(frictionOf('default'));
  });

  it('applyFriction preserves Y', () => {
    const v = applyFriction({ x: 1, y: 5, z: 1 }, 'ice');
    expect(v.y).toBe(5);
  });

  it('speed cap bonus on ice', () => {
    expect(speedCapMultiplier('blue_ice')).toBeGreaterThan(speedCapMultiplier('default'));
  });

  it('boat friction on blue ice is extreme', () => {
    expect(boatFrictionOf('blue_ice')).toBeGreaterThan(0.99);
  });
});
