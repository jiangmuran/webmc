import { describe, it, expect } from 'vitest';
import { willTrample, updateMoisture, MOISTURE_MAX } from './farmland_trample';

describe('farmland', () => {
  it('no trample on tiny fall', () => {
    expect(willTrample({ entityMass: 100, fallDistance: 0.2, rand: () => 0 })).toBe(false);
  });

  it('any fall > 0.5 tramples (wiki: deterministic, mass-independent)', () => {
    // Wiki (minecraft.wiki/w/Farmland): "Any entity that falls onto
    // farmland from a height of more than half a block (0.5 blocks)
    // turns it back into dirt." No mass factor, no probability —
    // any entity, any fall > 0.5, → dirt.
    expect(willTrample({ entityMass: 100, fallDistance: 2, rand: () => 0 })).toBe(true);
    expect(willTrample({ entityMass: 1, fallDistance: 0.8, rand: () => 0 })).toBe(true);
    expect(willTrample({ entityMass: 1, fallDistance: 2, rand: () => 0.99 })).toBe(true);
  });

  it('fall == 0.5 does NOT trample (boundary)', () => {
    expect(willTrample({ entityMass: 100, fallDistance: 0.5, rand: () => 0 })).toBe(false);
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
