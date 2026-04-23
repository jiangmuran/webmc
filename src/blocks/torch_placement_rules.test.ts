import { describe, it, expect } from 'vitest';
import { canPlace, placedOrientation, lightLevel } from './torch_placement_rules';

describe('torch placement rules', () => {
  it('up face places floor', () => {
    expect(canPlace({ clickedFace: 'up', backingSolid: true, isSoulTorch: false })).toBe(true);
    expect(placedOrientation({ clickedFace: 'up', backingSolid: true, isSoulTorch: false })).toBe(
      'floor',
    );
  });

  it('ceiling no place', () => {
    expect(canPlace({ clickedFace: 'down', backingSolid: true, isSoulTorch: false })).toBe(false);
  });

  it('wall placement', () => {
    expect(placedOrientation({ clickedFace: 'north', backingSolid: true, isSoulTorch: false })).toBe(
      'wall_north',
    );
  });

  it('soul dimmer', () => {
    expect(lightLevel({ clickedFace: 'up', backingSolid: true, isSoulTorch: true })).toBeLessThan(
      lightLevel({ clickedFace: 'up', backingSolid: true, isSoulTorch: false }),
    );
  });
});
