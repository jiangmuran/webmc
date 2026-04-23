import { describe, it, expect } from 'vitest';
import { stickVector } from './touch_dpad';

describe('touch dpad', () => {
  const center = { x: 100, y: 100, active: true };

  it('inactive zero', () => {
    expect(stickVector(center, { x: 120, y: 100, active: false }, 50)).toEqual({
      forward: 0,
      strafe: 0,
    });
  });

  it('push right', () => {
    const r = stickVector(center, { x: 150, y: 100, active: true }, 50);
    expect(r.strafe).toBeGreaterThan(0);
    expect(r.forward).toBeCloseTo(0);
  });

  it('push forward (up)', () => {
    const r = stickVector(center, { x: 100, y: 50, active: true }, 50);
    expect(r.forward).toBeGreaterThan(0);
  });

  it('dead zone zero', () => {
    const r = stickVector(center, { x: 101, y: 101, active: true }, 50);
    expect(r.forward).toBe(0);
    expect(r.strafe).toBe(0);
  });
});
