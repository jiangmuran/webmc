import { describe, it, expect } from 'vitest';
import {
  beamActive,
  healThisTick,
  onCrystalDestroyed,
  CRYSTAL_BEAM_RANGE,
} from './ender_crystal_beam_link';

describe('ender crystal beam link', () => {
  it('in range both alive', () => {
    expect(beamActive({ crystalAlive: true, dragonAlive: true, distance: 10 })).toBe(true);
  });

  it('out of range', () => {
    expect(
      beamActive({ crystalAlive: true, dragonAlive: true, distance: CRYSTAL_BEAM_RANGE + 1 }),
    ).toBe(false);
  });

  it('dead crystal no beam', () => {
    expect(beamActive({ crystalAlive: false, dragonAlive: true, distance: 1 })).toBe(false);
  });

  it('heal rate = 1/20 HP/tick (wiki: 1 HP/sec per crystal)', () => {
    // Wiki minecraft.wiki/w/End_Crystal: "Each end crystal heals the
    // dragon at a rate of 1 HP per second" — that's 0.05 HP per
    // 20-Hz game tick. Old `1 HP/tick` was 20× too aggressive,
    // making the dragon effectively immortal while crystals stood.
    expect(healThisTick({ crystalAlive: true, dragonAlive: true, distance: 5 })).toBeCloseTo(0.05);
  });

  it('no heal when inactive', () => {
    expect(healThisTick({ crystalAlive: false, dragonAlive: true, distance: 5 })).toBe(0);
  });

  it('destroy explodes', () => {
    expect(onCrystalDestroyed().explosionRadius).toBe(6);
    expect(onCrystalDestroyed().beamRemoved).toBe(true);
  });
});
