import { describe, it, expect } from 'vitest';
import { throwEye, tickEye } from './eye_of_ender';

describe('eye of ender', () => {
  it('aims toward the target stronghold', () => {
    const e = throwEye({ x: 0, y: 64, z: 0 }, { x: 100, y: 64, z: 0 });
    expect(e.velocity.x).toBeGreaterThan(0);
  });

  it('no target → straight up', () => {
    const e = throwEye({ x: 0, y: 64, z: 0 }, null);
    expect(Math.abs(e.velocity.x)).toBeLessThan(0.01);
    expect(e.velocity.y).toBeGreaterThan(0);
  });

  it('pops after 4 seconds', () => {
    const e = throwEye({ x: 0, y: 64, z: 0 }, { x: 50, y: 64, z: 0 });
    let popped = false;
    for (let i = 0; i < 100; i++) {
      if (tickEye(e, 0.1, () => 0.5).popped) popped = true;
    }
    expect(popped).toBe(true);
  });

  it('20% chance to shatter', () => {
    let shattered = 0;
    for (let i = 0; i < 1000; i++) {
      const e = throwEye({ x: 0, y: 0, z: 0 }, null);
      e.lifetimeSec = 5;
      if (tickEye(e, 0.01, Math.random).shattered) shattered++;
    }
    expect(shattered).toBeGreaterThan(150);
    expect(shattered).toBeLessThan(280);
  });
});
