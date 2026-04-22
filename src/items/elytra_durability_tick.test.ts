import { describe, it, expect } from 'vitest';
import {
  canDeploy,
  ELYTRA_MAX_DURABILITY,
  MEMBRANE_REPAIR_AMOUNT,
  repairWithMembrane,
  tickElytraDurability,
} from './elytra_durability_tick';

describe('elytra durability', () => {
  it('no drain when not gliding', () => {
    const r = tickElytraDurability({
      gliding: false,
      unbreakingLevel: 0,
      dtSec: 10,
      secondsCarry: 0,
      randomRoll: () => 0,
      currentDurability: 100,
    });
    expect(r.newDurability).toBe(100);
  });

  it('drains 1 per second gliding', () => {
    const r = tickElytraDurability({
      gliding: true,
      unbreakingLevel: 0,
      dtSec: 3,
      secondsCarry: 0,
      randomRoll: () => 0.9,
      currentDurability: 100,
    });
    expect(r.newDurability).toBe(97);
  });

  it('unbreaking reduces drain', () => {
    const r = tickElytraDurability({
      gliding: true,
      unbreakingLevel: 3,
      dtSec: 10,
      secondsCarry: 0,
      randomRoll: () => 0.1,
      currentDurability: 100,
    });
    expect(r.newDurability).toBe(100);
  });

  it('breaks at durability ≤ 1', () => {
    const r = tickElytraDurability({
      gliding: true,
      unbreakingLevel: 0,
      dtSec: 5,
      secondsCarry: 0,
      randomRoll: () => 0.9,
      currentDurability: 3,
    });
    expect(r.brokenThisTick).toBe(true);
  });

  it('phantom membrane repairs 108', () => {
    expect(repairWithMembrane(200)).toBe(308);
    expect(MEMBRANE_REPAIR_AMOUNT).toBe(108);
  });

  it('caps repair at max', () => {
    expect(repairWithMembrane(400)).toBe(ELYTRA_MAX_DURABILITY);
  });

  it('canDeploy only above 1', () => {
    expect(canDeploy(2)).toBe(true);
    expect(canDeploy(1)).toBe(false);
  });
});
