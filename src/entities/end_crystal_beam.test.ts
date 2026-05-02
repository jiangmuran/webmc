import { describe, it, expect } from 'vitest';
import {
  CRYSTAL_DESTRUCTION_EXPLOSION_POWER,
  CRYSTAL_HEAL_PER_TICK,
  destroyCrystal,
  makeEndCrystal,
  tickCrystalBeam,
} from './end_crystal_beam';

describe('end crystal beam', () => {
  it('dragon nearby + LOS = heals at 0.1 HP/tick (wiki: 1 HP per half-second)', () => {
    // Wiki minecraft.wiki/w/End_Crystal#Healing_the_ender_dragon:
    // "The dragon is healed 1 HP each half-second."
    const c = makeEndCrystal(1, { x: 0, y: 60, z: 0 });
    const r = tickCrystalBeam(c, {
      dragonHead: { x: 10, y: 60, z: 0 },
      hasLineOfSight: () => true,
    });
    expect(r.healing).toBe(true);
    expect(r.amount).toBeCloseTo(CRYSTAL_HEAL_PER_TICK);
    expect(r.amount).toBeCloseTo(0.1);
  });

  it('no dragon = no heal', () => {
    const c = makeEndCrystal(1, { x: 0, y: 60, z: 0 });
    const r = tickCrystalBeam(c, { dragonHead: null, hasLineOfSight: () => true });
    expect(r.healing).toBe(false);
  });

  it('out of range = no heal', () => {
    const c = makeEndCrystal(1, { x: 0, y: 60, z: 0 });
    const r = tickCrystalBeam(c, {
      dragonHead: { x: 100, y: 60, z: 0 },
      hasLineOfSight: () => true,
    });
    expect(r.healing).toBe(false);
  });

  it('no LOS = no heal', () => {
    const c = makeEndCrystal(1, { x: 0, y: 60, z: 0 });
    const r = tickCrystalBeam(c, {
      dragonHead: { x: 10, y: 60, z: 0 },
      hasLineOfSight: () => false,
    });
    expect(r.healing).toBe(false);
  });

  it('destroy explodes with power 6', () => {
    const c = makeEndCrystal(1, { x: 0, y: 60, z: 0 });
    const r = destroyCrystal(c);
    expect(r?.explosionPower).toBe(CRYSTAL_DESTRUCTION_EXPLOSION_POWER);
    expect(c.alive).toBe(false);
  });

  it('destroying dead crystal returns null', () => {
    const c = makeEndCrystal(1, { x: 0, y: 60, z: 0 });
    destroyCrystal(c);
    expect(destroyCrystal(c)).toBeNull();
  });
});
