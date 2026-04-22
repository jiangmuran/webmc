import { describe, it, expect } from 'vitest';
import { willTrample, updateMoisture, MOISTURE_MAX } from './farmland_trample';

describe('farmland', () => {
  it('no trample on tiny fall', () => {
    expect(willTrample({ entityMass: 100, fallDistance: 0.2, rand: () => 0 })).toBe(false);
  });

  it('heavy fall tramples', () => {
    expect(willTrample({ entityMass: 100, fallDistance: 2, rand: () => 0 })).toBe(true);
  });

  it('small mob needs larger fall', () => {
    expect(willTrample({ entityMass: 1, fallDistance: 0.8, rand: () => 0 })).toBe(false);
    expect(willTrample({ entityMass: 1, fallDistance: 2, rand: () => 0 })).toBe(true);
  });

  it('water restores moisture', () => {
    expect(updateMoisture({ currentMoisture: 3, waterWithinRadius: true, rand: () => 0 })).toBe(
      MOISTURE_MAX,
    );
  });

  it('dry farmland decays', () => {
    expect(updateMoisture({ currentMoisture: 5, waterWithinRadius: false, rand: () => 0 })).toBe(4);
  });

  it('already zero stays', () => {
    expect(updateMoisture({ currentMoisture: 0, waterWithinRadius: false, rand: () => 0 })).toBe(0);
  });
});
