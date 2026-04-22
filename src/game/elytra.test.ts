import { describe, it, expect } from 'vitest';
import { tickElytra } from './elytra';

describe('elytra', () => {
  it('falls slowly without input', () => {
    let v = { x: 0, y: 0, z: 0 };
    for (let i = 0; i < 20; i++) {
      v = tickElytra({ velocity: v, pitchRad: 0, yawRad: 0, firework: false }, 1 / 20);
    }
    expect(v.y).toBeLessThan(0);
    // But falls slower than 20 * gravity (= 16).
    expect(v.y).toBeGreaterThan(-10);
  });

  it('dive converts altitude to horizontal speed', () => {
    let v = { x: 0, y: -5, z: 0 };
    for (let i = 0; i < 40; i++) {
      v = tickElytra({ velocity: v, pitchRad: -Math.PI / 3, yawRad: 0, firework: false }, 1 / 20);
    }
    expect(Math.hypot(v.x, v.z)).toBeGreaterThan(0.01);
  });

  it('firework boost adds forward velocity', () => {
    const base = { x: 0, y: 0, z: 0 };
    const boost = tickElytra({ velocity: base, pitchRad: 0, yawRad: 0, firework: true }, 1 / 20);
    expect(Math.hypot(boost.x, boost.z)).toBeGreaterThan(0.01);
  });

  it('drag decays horizontal velocity', () => {
    let v = { x: 10, y: 0, z: 0 };
    for (let i = 0; i < 100; i++) {
      v = tickElytra({ velocity: v, pitchRad: 0, yawRad: 0, firework: false }, 1 / 20);
    }
    expect(Math.abs(v.x)).toBeLessThan(10);
  });
});
