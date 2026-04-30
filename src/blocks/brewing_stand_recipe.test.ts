import { describe, it, expect } from 'vitest';
import {
  resultPotion,
  fuelUsedPerBrew,
  BREW_TIME_TICKS,
  BLAZE_FUEL_POWDER,
} from './brewing_stand_recipe';

describe('brewing stand recipe', () => {
  it('water + wart → awkward', () => {
    expect(resultPotion({ base: 'water', ingredient: 'nether_wart' })).toBe('awkward');
  });

  it('water + redstone → mundane (wiki)', () => {
    expect(resultPotion({ base: 'water', ingredient: 'redstone' })).toBe('mundane');
  });

  it('water + glowstone_dust → thick (wiki)', () => {
    expect(resultPotion({ base: 'water', ingredient: 'glowstone_dust' })).toBe('thick');
  });

  it('awkward + blaze powder → strength', () => {
    expect(resultPotion({ base: 'awkward', ingredient: 'blaze_powder' })).toBe('strength');
  });

  it('awkward + pufferfish → water breathing', () => {
    expect(resultPotion({ base: 'awkward', ingredient: 'pufferfish' })).toBe('water_breathing');
  });

  it('unknown combo is undefined', () => {
    expect(resultPotion({ base: 'awkward', ingredient: 'diamond' })).toBeUndefined();
  });

  it('fuel 1 per brew', () => {
    expect(fuelUsedPerBrew()).toBe(1);
  });

  it('brew time + blaze fuel positive', () => {
    expect(BREW_TIME_TICKS).toBeGreaterThan(0);
    expect(BLAZE_FUEL_POWDER).toBeGreaterThan(0);
  });
});
