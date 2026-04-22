import { describe, it, expect } from 'vitest';
import {
  canPlantWitherRoseOn,
  dropsWitherRose,
  isWitherRoseBoneMealable,
  witherRoseEffect,
} from './wither_rose';

describe('wither rose', () => {
  it('contact applies 2s wither', () => {
    const r = witherRoseEffect({ entityKind: 'cow', inContactWithRose: true, dtSec: 0.1 });
    expect(r.applyWitherSec).toBe(2);
  });

  it('wither is immune to its own rose', () => {
    expect(
      witherRoseEffect({ entityKind: 'wither', inContactWithRose: true, dtSec: 0.1 })
        .applyWitherSec,
    ).toBe(0);
  });

  it('no contact = no effect', () => {
    expect(
      witherRoseEffect({ entityKind: 'cow', inContactWithRose: false, dtSec: 0.1 }).applyWitherSec,
    ).toBe(0);
  });

  it('wither-killing cow drops rose', () => {
    expect(dropsWitherRose({ victimKind: 'cow', roseNotYetPlaced: true })).toBe(true);
  });

  it('wither kin do not drop rose', () => {
    expect(dropsWitherRose({ victimKind: 'wither_skeleton', roseNotYetPlaced: true })).toBe(false);
    expect(dropsWitherRose({ victimKind: 'ender_dragon', roseNotYetPlaced: true })).toBe(false);
  });

  it('bone meal does nothing', () => {
    expect(isWitherRoseBoneMealable()).toBe(false);
  });

  it('plantable on dirt + soul_soil', () => {
    expect(canPlantWitherRoseOn('webmc:dirt')).toBe(true);
    expect(canPlantWitherRoseOn('webmc:soul_soil')).toBe(true);
    expect(canPlantWitherRoseOn('webmc:stone')).toBe(false);
  });
});
