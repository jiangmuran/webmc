import { describe, it, expect } from 'vitest';
import { applyCvd, identityOn } from './accessibility_cvd';

describe('cvd', () => {
  it('none is identity', () => {
    const c = { r: 120, g: 80, b: 40 };
    expect(applyCvd(c, 'none')).toEqual(c);
    expect(identityOn('none')).toBe(true);
  });

  it('protanopia alters red', () => {
    const red = { r: 255, g: 0, b: 0 };
    const out = applyCvd(red, 'protanopia');
    expect(out.r).toBeLessThan(255);
  });

  it('clamps within 0..255', () => {
    const out = applyCvd({ r: 255, g: 255, b: 255 }, 'deuteranopia');
    expect(out.r).toBeLessThanOrEqual(255);
    expect(out.g).toBeGreaterThanOrEqual(0);
  });

  it('deterministic', () => {
    const a = applyCvd({ r: 100, g: 150, b: 200 }, 'tritanopia');
    const b = applyCvd({ r: 100, g: 150, b: 200 }, 'tritanopia');
    expect(a).toEqual(b);
  });
});
