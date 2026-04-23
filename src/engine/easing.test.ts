import { describe, it, expect } from 'vitest';
import {
  linear,
  smoothstep,
  smootherstep,
  easeInQuad,
  easeOutQuad,
  easeInOutQuad,
  easeOutBack,
} from './easing';

describe('easing', () => {
  it('linear identity', () => {
    expect(linear(0)).toBe(0);
    expect(linear(0.3)).toBe(0.3);
    expect(linear(1)).toBe(1);
  });

  it('smoothstep endpoints', () => {
    expect(smoothstep(0)).toBe(0);
    expect(smoothstep(1)).toBe(1);
    expect(smoothstep(0.5)).toBeCloseTo(0.5);
  });

  it('smootherstep endpoints', () => {
    expect(smootherstep(0)).toBe(0);
    expect(smootherstep(1)).toBe(1);
  });

  it('easeInQuad', () => {
    expect(easeInQuad(0.5)).toBe(0.25);
  });

  it('easeOutQuad mirror', () => {
    expect(easeOutQuad(0.5)).toBe(0.75);
  });

  it('easeInOutQuad symmetric', () => {
    expect(easeInOutQuad(0.25)).toBeCloseTo(1 - easeInOutQuad(0.75));
  });

  it('easeOutBack overshoots', () => {
    // Peak above 1 in 0.7-0.8 region
    let overshot = false;
    for (let t = 0.5; t <= 1; t += 0.01) if (easeOutBack(t) > 1) overshot = true;
    expect(overshot).toBe(true);
  });

  it('clamps outside range', () => {
    expect(linear(-1)).toBe(0);
    expect(linear(2)).toBe(1);
  });
});
