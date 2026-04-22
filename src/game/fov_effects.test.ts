import { describe, it, expect } from 'vitest';
import { computedFov } from './fov_effects';

describe('fov effects', () => {
  it('default identity', () => {
    expect(
      computedFov({
        baseFov: 70,
        sprinting: false,
        bowDrawFraction: 0,
        speedMult: 1,
        nauseaIntensity: 0,
        tickMs: 0,
      }),
    ).toBe(70);
  });

  it('sprint widens', () => {
    const f = computedFov({
      baseFov: 70,
      sprinting: true,
      bowDrawFraction: 0,
      speedMult: 1,
      nauseaIntensity: 0,
      tickMs: 0,
    });
    expect(f).toBeGreaterThan(70);
  });

  it('bow narrows', () => {
    const f = computedFov({
      baseFov: 70,
      sprinting: false,
      bowDrawFraction: 1,
      speedMult: 1,
      nauseaIntensity: 0,
      tickMs: 0,
    });
    expect(f).toBeLessThan(70);
  });

  it('clamp 30..179', () => {
    const tiny = computedFov({
      baseFov: 10,
      sprinting: false,
      bowDrawFraction: 1,
      speedMult: 1,
      nauseaIntensity: 0,
      tickMs: 0,
    });
    expect(tiny).toBe(30);
    const huge = computedFov({
      baseFov: 200,
      sprinting: true,
      bowDrawFraction: 0,
      speedMult: 5,
      nauseaIntensity: 0,
      tickMs: 0,
    });
    expect(huge).toBe(179);
  });
});
