import { describe, it, expect } from 'vitest';
import { makeGlide, tickGlide, applyFireworkBoost, speed, GRAVITY } from './elytra_glide';

describe('elytra glide', () => {
  it('gravity applies when not gliding', () => {
    const s = makeGlide();
    tickGlide(s);
    expect(s.velY).toBe(-GRAVITY);
  });

  it('gliding reduces fall', () => {
    const a = makeGlide();
    const b = makeGlide();
    b.gliding = true;
    b.pitch = -0.5; // looking up
    tickGlide(a);
    tickGlide(b);
    expect(Math.abs(b.velY)).toBeLessThan(Math.abs(a.velY));
  });

  it('dive gains forward speed', () => {
    const s = makeGlide();
    s.gliding = true;
    s.pitch = 1.0; // diving
    tickGlide(s);
    expect(speed(s)).toBeGreaterThan(GRAVITY * 0.5);
  });

  it('firework boost requires gliding', () => {
    const s = makeGlide();
    applyFireworkBoost(s, 2);
    expect(speed(s)).toBe(0);
    s.gliding = true;
    applyFireworkBoost(s, 2);
    expect(speed(s)).toBeGreaterThan(0);
  });
});
