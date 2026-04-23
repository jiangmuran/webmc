import { describe, it, expect } from 'vitest';
import { angleToTarget, distance } from './compass_follow_player';

describe('compass follow player', () => {
  it('zero distance at same spot', () => {
    expect(distance({ x: 0, z: 0, yawRad: 0 }, { x: 0, z: 0 })).toBe(0);
  });

  it('distance pythagoras', () => {
    expect(distance({ x: 0, z: 0, yawRad: 0 }, { x: 3, z: 4 })).toBe(5);
  });

  it('angle returns finite', () => {
    const a = angleToTarget({ x: 0, z: 0, yawRad: 0 }, { x: 10, z: 0 });
    expect(Number.isFinite(a)).toBe(true);
  });
});
