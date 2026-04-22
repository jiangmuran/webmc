import { describe, it, expect } from 'vitest';
import { blendColors, colorOf } from './potion_particle_color';

describe('potion particle color', () => {
  it('empty default water blue', () => {
    expect(blendColors([])).toBe(0x385dc6);
  });

  it('single effect returns its color', () => {
    expect(blendColors([{ rgb: 0xff0000, amplifier: 0 }])).toBe(0xff0000);
  });

  it('blends two equal weights', () => {
    const c = blendColors([
      { rgb: 0xff0000, amplifier: 0 },
      { rgb: 0x0000ff, amplifier: 0 },
    ]);
    const r = (c >> 16) & 0xff;
    const b = c & 0xff;
    expect(r).toBeCloseTo(128, -1);
    expect(b).toBeCloseTo(128, -1);
  });

  it('amplifier weights higher', () => {
    const c = blendColors([
      { rgb: 0xff0000, amplifier: 3 },
      { rgb: 0x0000ff, amplifier: 0 },
    ]);
    const r = (c >> 16) & 0xff;
    expect(r).toBeGreaterThan(128);
  });

  it('colorOf known', () => {
    expect(colorOf('poison')).toBe(0x4e9331);
    expect(colorOf('nonsense')).toBeUndefined();
  });
});
