import { describe, it, expect } from 'vitest';
import {
  smeltTime,
  fuelTickAtBurnTime,
  DEFAULT_SMELT_TIME_TICKS,
} from './furnace_smelt_time';

describe('furnace smelt time', () => {
  it('default 200', () => {
    expect(smeltTime('furnace')).toBe(DEFAULT_SMELT_TIME_TICKS);
  });

  it('blast furnace 2x speed', () => {
    expect(smeltTime('blast_furnace')).toBeLessThan(smeltTime('furnace'));
  });

  it('smoker also 2x', () => {
    expect(smeltTime('smoker')).toBeLessThan(smeltTime('furnace'));
  });

  it('fuel bound to burn time', () => {
    expect(fuelTickAtBurnTime(100, 200)).toBe(100);
    expect(fuelTickAtBurnTime(0, 50)).toBe(0);
  });
});
