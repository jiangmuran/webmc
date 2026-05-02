import { describe, it, expect } from 'vitest';
import {
  shouldReturnHive,
  growsCropBelow,
  incrementHoneyLevel,
  POLLEN_FERTILIZE_CHANCE,
  type BeeState,
} from './bee_pollen_deposit';

const base: BeeState = {
  pollenLoaded: false,
  ticksOutsideHive: 0,
  dayCycleStage: 'day',
};

describe('bee pollen', () => {
  it('returns home at night', () => {
    expect(shouldReturnHive({ ...base, dayCycleStage: 'night' })).toBe(true);
  });

  it('returns with pollen', () => {
    expect(shouldReturnHive({ ...base, pollenLoaded: true })).toBe(true);
  });

  it('angry does not return', () => {
    expect(shouldReturnHive({ ...base, pollenLoaded: true, angeredAt: 'alice' })).toBe(false);
  });

  it('crop growth requires pollen', () => {
    expect(growsCropBelow(true, base, () => 0.001)).toBe(false);
  });

  it('crop growth chance', () => {
    expect(growsCropBelow(true, { ...base, pollenLoaded: true }, () => 0.001)).toBe(true);
  });

  it('crop growth chance is wiki ~5% per tick (not stub 1/30)', () => {
    expect(POLLEN_FERTILIZE_CHANCE).toBe(0.05);
    // boundary: 0.04999 < 0.05 → true; 0.05 NOT < 0.05 → false
    expect(growsCropBelow(true, { ...base, pollenLoaded: true }, () => 0.04999)).toBe(true);
    expect(growsCropBelow(true, { ...base, pollenLoaded: true }, () => 0.05)).toBe(false);
  });

  it('honey level increments', () => {
    expect(incrementHoneyLevel(1, true)).toBe(2);
  });

  it('honey level caps at 5', () => {
    expect(incrementHoneyLevel(5, true)).toBe(5);
  });
});
