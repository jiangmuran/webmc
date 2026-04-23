import { describe, it, expect } from 'vitest';
import { radiusAt, isFinished, damagePerBlockOutside, isOutside } from './world_border_shrink';

const anim = { fromRadius: 100, toRadius: 50, startMs: 0, durationMs: 1000 };

describe('world border shrink', () => {
  it('radius at start', () => {
    expect(radiusAt(anim, 0)).toBe(100);
  });

  it('radius at end', () => {
    expect(radiusAt(anim, 1000)).toBe(50);
  });

  it('halfway lerp', () => {
    expect(radiusAt(anim, 500)).toBe(75);
  });

  it('finished', () => {
    expect(isFinished(anim, 1500)).toBe(true);
  });

  it('damage per block > 0', () => {
    expect(damagePerBlockOutside()).toBeGreaterThan(0);
  });

  it('outside detected', () => {
    expect(isOutside({ x: 200, z: 0 }, 100, { x: 0, z: 0 })).toBe(true);
    expect(isOutside({ x: 50, z: 0 }, 100, { x: 0, z: 0 })).toBe(false);
  });
});
