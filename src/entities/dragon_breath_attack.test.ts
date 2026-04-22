import { describe, it, expect } from 'vitest';
import {
  cloudAffects,
  cloudActive,
  inCone,
  makeBreathCone,
  makeDragonBreathCloud,
} from './dragon_breath_attack';

describe('dragon breath', () => {
  it('target in cone', () => {
    const cone = makeBreathCone({ x: 0, y: 60, z: 0 }, { x: 1, y: 0, z: 0 }, 0);
    expect(inCone(cone, { x: 5, y: 60, z: 0 })).toBe(true);
  });

  it('target outside cone', () => {
    const cone = makeBreathCone({ x: 0, y: 60, z: 0 }, { x: 1, y: 0, z: 0 }, 0);
    expect(inCone(cone, { x: 5, y: 60, z: 20 })).toBe(false);
  });

  it('target too far', () => {
    const cone = makeBreathCone({ x: 0, y: 60, z: 0 }, { x: 1, y: 0, z: 0 }, 0);
    expect(inCone(cone, { x: 100, y: 60, z: 0 })).toBe(false);
  });

  it('cloud active 30s', () => {
    const c = makeDragonBreathCloud({ x: 0, y: 60, z: 0 }, 0);
    expect(cloudActive(c, 15)).toBe(true);
    expect(cloudActive(c, 35)).toBe(false);
  });

  it('cloud affects nearby', () => {
    const c = makeDragonBreathCloud({ x: 0, y: 60, z: 0 }, 0);
    expect(cloudAffects(c, { x: 1, y: 60, z: 0 })).toBe(true);
    expect(cloudAffects(c, { x: 10, y: 60, z: 0 })).toBe(false);
  });
});
