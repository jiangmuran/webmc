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

  it('heal tick when active', () => {
    expect(healThisTick({ crystalAlive: true, dragonAlive: true, distance: 5 })).toBe(1);
  });

  it('no heal when inactive', () => {
    expect(healThisTick({ crystalAlive: false, dragonAlive: true, distance: 5 })).toBe(0);
  });

  it('destroy explodes', () => {
    expect(onCrystalDestroyed().explosionRadius).toBe(6);
    expect(onCrystalDestroyed().beamRemoved).toBe(true);
  });
});
