import { describe, it, expect } from 'vitest';
import {
  ANIMATED,
  frameAtTick,
  interpolationBlend,
  nextFrame,
  type AnimatedTextureDef,
} from './texture_animation';

function mustGet(key: string): AnimatedTextureDef {
  const v = ANIMATED[key];
  if (!v) throw new Error(`missing texture ${key}`);
  return v;
}

describe('texture animation', () => {
  it('tick 0 = frame 0', () => {
    expect(frameAtTick(mustGet('water_still'), 0)).toBe(0);
  });

  it('advances per frame duration', () => {
    const def = mustGet('water_still');
    expect(frameAtTick(def, 2)).toBe(1);
    expect(frameAtTick(def, 4)).toBe(2);
  });

  it('wraps around', () => {
    const def = mustGet('water_still');
    expect(frameAtTick(def, 64)).toBe(0);
  });

  it('interpolation blend is 0 at frame start', () => {
    expect(interpolationBlend(mustGet('water_still'), 0)).toBe(0);
  });

  it('interpolation blend grows within a frame', () => {
    const def = mustGet('water_still');
    expect(interpolationBlend(def, 1)).toBeCloseTo(0.5);
  });

  it('non-interpolated texture = 0 blend', () => {
    expect(interpolationBlend(mustGet('magma'), 1)).toBe(0);
  });

  it('nextFrame wraps', () => {
    const def = mustGet('sea_lantern');
    expect(nextFrame(def, 4)).toBe(0);
  });

  it('end portal has 1 frame', () => {
    expect(mustGet('end_portal').frameCount).toBe(1);
  });
});
