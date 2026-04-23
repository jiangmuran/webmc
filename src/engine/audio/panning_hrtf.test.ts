import { describe, it, expect } from 'vitest';
import { relativePosition, stereoPan } from './panning_hrtf';

describe('panning hrtf', () => {
  it('sound on right (+x, yaw 0)', () => {
    const r = relativePosition({ x: 0, y: 0, z: 0, yaw: 0 }, { x: 10, y: 0, z: 0 });
    expect(r.dxRight).toBeCloseTo(10);
  });

  it('sound above', () => {
    const r = relativePosition({ x: 0, y: 0, z: 0, yaw: 0 }, { x: 0, y: 5, z: 0 });
    expect(r.dyUp).toBe(5);
  });

  it('stereo pan right', () => {
    expect(stereoPan(5, 5)).toBeCloseTo(1);
  });

  it('stereo pan left', () => {
    expect(stereoPan(-5, 5)).toBeCloseTo(-1);
  });

  it('center zero distance safe', () => {
    expect(stereoPan(0, 0)).toBe(0);
  });

  it('clamps beyond distance', () => {
    expect(stereoPan(100, 5)).toBe(1);
  });
});
