import { describe, it, expect } from 'vitest';
import { mixColors, splashAreaColor, POTION_COLORS } from './potion_color_mix';

describe('potion color mix', () => {
  it('known id', () => {
    expect(POTION_COLORS['speed']).toBeDefined();
  });

  it('no effects → base blue', () => {
    const c = mixColors([]);
    expect(c[2]).toBeGreaterThan(c[0]);
  });

  it('single effect passes through', () => {
    expect(mixColors(['poison'])).toEqual(POTION_COLORS['poison']);
  });

  it('mix averages', () => {
    const m = mixColors(['speed', 'strength']);
    const a = POTION_COLORS['speed'] ?? [0, 0, 0];
    const b = POTION_COLORS['strength'] ?? [0, 0, 0];
    expect(m[0]).toBeCloseTo((a[0] + b[0]) / 2);
  });

  it('unknown ignored', () => {
    expect(mixColors(['unknown'])).toEqual(mixColors([]));
  });

  it('splash darker than base', () => {
    const base: [number, number, number] = [100, 100, 100];
    expect(splashAreaColor(base)[0]).toBeLessThan(base[0]);
  });
});
