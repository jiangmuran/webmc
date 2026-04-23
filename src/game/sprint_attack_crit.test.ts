import { describe, it, expect } from 'vitest';
import { isCritical, critMultiplier, sprintKnockbackBoost } from './sprint_attack_crit';

const baseCrit = {
  sprinting: false,
  airborne: true,
  falling: true,
  onLadder: false,
  inWater: false,
  fullyCharged: true,
  blindOrSlow: false,
};

describe('sprint attack crit', () => {
  it('canonical crit passes', () => {
    expect(isCritical(baseCrit)).toBe(true);
  });

  it('sprinting disables', () => {
    expect(isCritical({ ...baseCrit, sprinting: true })).toBe(false);
  });

  it('not falling disables', () => {
    expect(isCritical({ ...baseCrit, falling: false })).toBe(false);
  });

  it('low charge disables', () => {
    expect(isCritical({ ...baseCrit, fullyCharged: false })).toBe(false);
  });

  it('ladder/water disables', () => {
    expect(isCritical({ ...baseCrit, onLadder: true })).toBe(false);
  });

  it('crit multiplier 1.5', () => {
    expect(critMultiplier()).toBe(1.5);
  });

  it('sprint KB boost', () => {
    expect(sprintKnockbackBoost({ ...baseCrit, sprinting: true })).toBe(true);
  });
});
