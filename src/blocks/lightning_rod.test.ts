import { describe, it, expect } from 'vitest';
import {
  attractStrike,
  fireSignal,
  makeLightningRod,
  signalStrength,
  tickLightningRod,
} from './lightning_rod';

describe('lightning rod', () => {
  it('attracts strike to nearest rod in range', () => {
    const rods = [
      makeLightningRod({ x: 0, y: 80, z: 0 }),
      makeLightningRod({ x: 30, y: 80, z: 0 }),
    ];
    const r = attractStrike({ x: 5, y: 80, z: 0 }, rods);
    expect(r?.pos.x).toBe(0);
  });

  it('attracts within 128-block spherical radius (wiki: Java)', () => {
    const rods = [makeLightningRod({ x: 100, y: 80, z: 0 })];
    // strike at 100 blocks away on X axis, within the 128-sphere.
    const r = attractStrike({ x: 0, y: 80, z: 0 }, rods);
    expect(r?.pos.x).toBe(100);
  });

  it('ignores rods beyond 128-block sphere (wiki: Java)', () => {
    const rods = [makeLightningRod({ x: 200, y: 80, z: 0 })];
    expect(attractStrike({ x: 0, y: 80, z: 0 }, rods)).toBeNull();
  });

  it('signal fires for ~0.4s then clears', () => {
    const rod = makeLightningRod({ x: 0, y: 80, z: 0 });
    fireSignal(rod);
    expect(signalStrength(rod)).toBe(15);
    tickLightningRod(rod, 1);
    expect(signalStrength(rod)).toBe(0);
  });
});
