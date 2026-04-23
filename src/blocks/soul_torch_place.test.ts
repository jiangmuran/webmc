import { describe, it, expect } from 'vitest';
import {
  lightLevel,
  repelsPiglins,
  piglinAvoidRadius,
  canPlaceOnWallOrFloor,
} from './soul_torch_place';

describe('soul torch', () => {
  it('dim light 10', () => {
    expect(lightLevel()).toBe(10);
  });

  it('repels piglins', () => {
    expect(repelsPiglins()).toBe(true);
    expect(piglinAvoidRadius()).toBeGreaterThan(0);
  });

  it('floor or wall, not ceiling', () => {
    expect(canPlaceOnWallOrFloor('floor')).toBe(true);
    expect(canPlaceOnWallOrFloor('wall')).toBe(true);
    expect(canPlaceOnWallOrFloor('ceiling')).toBe(false);
  });
});
