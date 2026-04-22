import { describe, it, expect } from 'vitest';
import {
  applyClimbVelocity,
  slowFallOnWall,
  spiderSizeMultiplier,
  spiderSpeedMultiplier,
  updateClimbing,
  type SpiderState,
} from './spider_climb';

function mk(): SpiderState {
  return {
    position: { x: 0, y: 0, z: 0 },
    velocity: { x: 0, y: 0, z: 0 },
    climbing: false,
    walkIntent: { x: 0, y: 0, z: 0 },
  };
}

describe('spider climb', () => {
  it('climbs with wall + forward input', () => {
    const s = mk();
    updateClimbing(s, { hasSolidWallInFront: true, inputForward: 1 });
    expect(s.climbing).toBe(true);
  });

  it('no climb without wall', () => {
    const s = mk();
    updateClimbing(s, { hasSolidWallInFront: false, inputForward: 1 });
    expect(s.climbing).toBe(false);
  });

  it('no climb without input', () => {
    const s = mk();
    updateClimbing(s, { hasSolidWallInFront: true, inputForward: 0 });
    expect(s.climbing).toBe(false);
  });

  it('climb adds upward velocity', () => {
    const s = mk();
    s.climbing = true;
    applyClimbVelocity(s);
    expect(s.velocity.y).toBeGreaterThan(0);
  });

  it('wall stops downward fall', () => {
    const s = mk();
    s.climbing = true;
    expect(slowFallOnWall(s, -5)).toBe(0);
  });

  it('cave spider is smaller and faster', () => {
    expect(spiderSizeMultiplier('cave_spider')).toBeLessThan(1);
    expect(spiderSpeedMultiplier('cave_spider')).toBeGreaterThan(1);
  });
});
