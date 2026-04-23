import { describe, it, expect } from 'vitest';
import { sunDirection, shadowCastsFromLight, inverseDirection } from './shadow_sun_direction';

describe('shadow sun direction', () => {
  it('sun east at 0 rad', () => {
    const d = sunDirection(0);
    expect(d.x).toBeCloseTo(1);
    expect(d.y).toBeCloseTo(0);
  });

  it('sun up at π/2', () => {
    const d = sunDirection(Math.PI / 2);
    expect(d.y).toBeCloseTo(1);
  });

  it('shadow only above horizon', () => {
    expect(shadowCastsFromLight({ y: 0.5 })).toBe(true);
    expect(shadowCastsFromLight({ y: -0.5 })).toBe(false);
  });

  it('inverse negates', () => {
    expect(inverseDirection({ x: 1, y: 1, z: 1 })).toEqual({ x: -1, y: -1, z: -1 });
  });
});
