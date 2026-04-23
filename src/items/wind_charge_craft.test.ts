import { describe, it, expect } from 'vitest';
import {
  canCraft,
  yieldCount,
  stackSize,
  dispenserThrows,
  WIND_CHARGE_YIELD,
} from './wind_charge_craft';

describe('wind charge craft', () => {
  it('needs 1 rod', () => {
    expect(canCraft(1)).toBe(true);
    expect(canCraft(0)).toBe(false);
  });

  it('yields 4', () => {
    expect(yieldCount()).toBe(WIND_CHARGE_YIELD);
  });

  it('stack 64', () => {
    expect(stackSize()).toBe(64);
  });

  it('dispenser throws', () => {
    expect(dispenserThrows()).toBe(true);
  });
});
