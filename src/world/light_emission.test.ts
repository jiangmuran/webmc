import { describe, it, expect } from 'vitest';
import { emissionOf, isLightSource, registerEmission, totalEmission } from './light_emission';

describe('light emission', () => {
  it('torch emits 14', () => {
    expect(emissionOf('webmc:torch')).toBe(14);
  });

  it('glowstone emits 15', () => {
    expect(emissionOf('webmc:glowstone')).toBe(15);
  });

  it('stone emits 0', () => {
    expect(emissionOf('webmc:stone')).toBe(0);
  });

  it('soul torch dimmer than regular', () => {
    expect(emissionOf('webmc:soul_torch')).toBeLessThan(emissionOf('webmc:torch'));
  });

  it('isLightSource is correct', () => {
    expect(isLightSource('webmc:glowstone')).toBe(true);
    expect(isLightSource('webmc:stone')).toBe(false);
  });

  it('register clamps out of range', () => {
    registerEmission('webmc:big_lamp', 999);
    expect(emissionOf('webmc:big_lamp')).toBe(15);
    registerEmission('webmc:no_lamp', -5);
    expect(emissionOf('webmc:no_lamp')).toBe(0);
  });

  it('totalEmission sums a column', () => {
    const t = totalEmission(['webmc:torch', 'webmc:glowstone', 'webmc:stone']);
    expect(t).toBe(14 + 15);
  });

  it('amethyst buds scale by size', () => {
    const s = emissionOf('webmc:small_amethyst_bud');
    const l = emissionOf('webmc:large_amethyst_bud');
    expect(l).toBeGreaterThan(s);
  });
});
