import { describe, it, expect } from 'vitest';
import { shouldDecay, computeDistance, MAX_DISTANCE } from './leaf_decay';

describe('leaf decay', () => {
  it('persistent leaves never decay', () => {
    expect(shouldDecay({ persistent: true, distance: MAX_DISTANCE })).toBe(false);
  });

  it('far leaves decay', () => {
    expect(shouldDecay({ persistent: false, distance: MAX_DISTANCE })).toBe(true);
  });

  it('near leaves kept', () => {
    expect(shouldDecay({ persistent: false, distance: 2 })).toBe(false);
  });

  it('log neighbor → distance 1', () => {
    expect(computeDistance([], true)).toBe(1);
  });

  it('min neighbor + 1', () => {
    expect(computeDistance([1, 2, 3], false)).toBe(2);
  });

  it('isolated → max', () => {
    expect(computeDistance([MAX_DISTANCE], false)).toBe(MAX_DISTANCE);
  });
});
