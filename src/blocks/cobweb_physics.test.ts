import { describe, it, expect } from 'vitest';
import {
  applyCobwebVelocity,
  cobwebBreakSeconds,
  cobwebDrops,
  COBWEB_HORIZONTAL_SPEED_MULT,
  COBWEB_VERTICAL_SPEED_MULT,
  resetFallDistanceInWeb,
} from './cobweb_physics';

describe('cobweb physics', () => {
  it('slows horizontal & vertical', () => {
    const v = applyCobwebVelocity({ x: 10, y: 10, z: 10 }, true);
    expect(v.x).toBeCloseTo(10 * COBWEB_HORIZONTAL_SPEED_MULT);
    expect(v.y).toBeCloseTo(10 * COBWEB_VERTICAL_SPEED_MULT);
  });

  it('no effect outside web', () => {
    const v = applyCobwebVelocity({ x: 5, y: 5, z: 5 }, false);
    expect(v).toEqual({ x: 5, y: 5, z: 5 });
  });

  it('fall distance resets in web', () => {
    expect(resetFallDistanceInWeb(true, 10)).toBe(0);
    expect(resetFallDistanceInWeb(false, 10)).toBe(10);
  });

  it('shears and sword break fast', () => {
    expect(cobwebBreakSeconds('shears')).toBeLessThan(1);
    expect(cobwebBreakSeconds('sword')).toBeLessThan(1);
  });

  it('hand takes ~20s', () => {
    expect(cobwebBreakSeconds('hand')).toBe(20);
  });

  it('shears drop cobweb', () => {
    expect(cobwebDrops('shears')[0]?.item).toBe('webmc:cobweb');
  });

  it('sword drops string', () => {
    expect(cobwebDrops('sword')[0]?.item).toBe('webmc:string');
  });
});
