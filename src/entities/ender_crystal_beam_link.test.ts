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

  it('heal rate = 0.1 HP/tick (wiki: 1 HP per half-second)', () => {
    // Wiki minecraft.wiki/w/End_Crystal#Healing_the_ender_dragon:
    // "The dragon is healed 1 HP each half-second." 1/0.5 = 2 HP/sec
    // = 0.1 HP per 20-Hz tick. Old `1 HP/tick` was 10× too high.
    expect(healThisTick({ crystalAlive: true, dragonAlive: true, distance: 5 })).toBeCloseTo(0.1);
  });

  it('no heal when inactive', () => {
    expect(healThisTick({ crystalAlive: false, dragonAlive: true, distance: 5 })).toBe(0);
  });

  it('destroy explodes', () => {
    expect(onCrystalDestroyed().explosionRadius).toBe(6);
    expect(onCrystalDestroyed().beamRemoved).toBe(true);
  });
});
