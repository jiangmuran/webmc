import { describe, it, expect } from 'vitest';
import {
  absorbsInRadius,
  becomesWet,
  cappedAbsorption,
  MAX_BLOCKS_ABSORBED,
} from './dry_sponge_water_absorb';

describe('dry sponge water absorb', () => {
  it('in radius absorbs', () => {
    expect(absorbsInRadius(5)).toBe(true);
    expect(absorbsInRadius(8)).toBe(false);
  });

  it('wet only if absorbed', () => {
    expect(becomesWet(5)).toBe(true);
    expect(becomesWet(0)).toBe(false);
  });

  it('caps at MAX_BLOCKS_ABSORBED', () => {
    expect(cappedAbsorption(MAX_BLOCKS_ABSORBED * 2)).toBe(MAX_BLOCKS_ABSORBED);
  });

  it('negative floors 0', () => {
    expect(cappedAbsorption(-5)).toBe(0);
  });
});
