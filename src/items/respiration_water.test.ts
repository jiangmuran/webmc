import { describe, it, expect } from 'vitest';
import {
  breathTicks,
  avoidDrowningChance,
  improvesVisibility,
  BREATH_BASE_TICKS,
} from './respiration_water';

describe('respiration water', () => {
  it('base 15s', () => {
    expect(breathTicks(0)).toBe(BREATH_BASE_TICKS);
  });

  it('level 3 = 60s', () => {
    expect(breathTicks(3)).toBe(1200);
  });

  it('caps above level 3', () => {
    expect(breathTicks(5)).toBe(breathTicks(3));
  });

  it('no avoid at 0', () => {
    expect(avoidDrowningChance(0)).toBe(0);
  });

  it('avoid at level 3 = 0.75', () => {
    expect(avoidDrowningChance(3)).toBeCloseTo(0.75);
  });

  it('visibility with any level', () => {
    expect(improvesVisibility(1)).toBe(true);
    expect(improvesVisibility(0)).toBe(false);
  });
});
