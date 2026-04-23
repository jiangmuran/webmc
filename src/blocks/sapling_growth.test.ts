import { describe, it, expect } from 'vitest';
import { randomTick, canGrowHere, SAPLING_MIN_LIGHT } from './sapling_growth';

describe('sapling growth', () => {
  it('too dark no-op', () => {
    const r = randomTick({ stage: 0, lightLevel: 4, verticalClearance: 10 }, () => 0);
    expect(r).toEqual({ stage: 0, lightLevel: 4, verticalClearance: 10 });
  });

  it('stage 0 → 1 on lucky roll', () => {
    const r = randomTick({ stage: 0, lightLevel: 15, verticalClearance: 10 }, () => 0);
    expect(r).toEqual({ stage: 1, lightLevel: 15, verticalClearance: 10 });
  });

  it('grows tree at stage 1 with clearance', () => {
    expect(randomTick({ stage: 1, lightLevel: 15, verticalClearance: 10 }, () => 0)).toBe(
      'grow_tree',
    );
  });

  it('no tree without clearance', () => {
    const r = randomTick({ stage: 1, lightLevel: 15, verticalClearance: 2 }, () => 0);
    expect(r).not.toBe('grow_tree');
  });

  it('canGrowHere composite', () => {
    expect(canGrowHere({ stage: 0, lightLevel: SAPLING_MIN_LIGHT, verticalClearance: 10 })).toBe(
      true,
    );
  });
});
