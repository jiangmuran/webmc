import { describe, it, expect } from 'vitest';
import {
  isAncientCityHorn,
  isGoatDroppedHorn,
  useCooldownTicks,
  audibleRangeBlocks,
} from './goat_horn_sound';

describe('goat horn sound', () => {
  it('ponder from city', () => {
    expect(isAncientCityHorn('ponder')).toBe(true);
  });

  it('dream from goat', () => {
    expect(isGoatDroppedHorn('dream')).toBe(true);
  });

  it('cooldown > 0', () => {
    expect(useCooldownTicks()).toBeGreaterThan(0);
  });

  it('range 256', () => {
    expect(audibleRangeBlocks()).toBe(256);
  });
});
