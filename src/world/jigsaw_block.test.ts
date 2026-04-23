import { describe, it, expect } from 'vitest';
import { matches, isRollable, becomesOnResolve } from './jigsaw_block';

const a = {
  name: 'village:house/bottom',
  target: 'village:house/top',
  pool: 'village:houses',
  finalState: 'oak_planks',
  joinType: 'aligned' as const,
};
const b = {
  name: 'village:house/top',
  target: 'village:empty',
  pool: 'village:houses',
  finalState: 'oak_planks',
  joinType: 'rollable' as const,
};

describe('jigsaw block', () => {
  it('matches target to name', () => {
    expect(matches(a, b)).toBe(true);
  });

  it('mismatch', () => {
    expect(matches(b, a)).toBe(false);
  });

  it('rollable flag', () => {
    expect(isRollable(a)).toBe(false);
    expect(isRollable(b)).toBe(true);
  });

  it('resolve block', () => {
    expect(becomesOnResolve(a)).toBe('oak_planks');
  });
});
