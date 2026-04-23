import { describe, it, expect } from 'vitest';
import { drinkMilk, drinkHoneyBottle, type Effect } from './milk_bucket_clear_effects';

const fx: Effect[] = [
  { id: 'poison', level: 1, durationTicks: 100, beneficial: false },
  { id: 'speed', level: 1, durationTicks: 100, beneficial: true },
];

describe('milk bucket clear effects', () => {
  it('milk clears everything', () => {
    expect(drinkMilk(fx)).toEqual([]);
  });

  it('honey clears poison only', () => {
    const r = drinkHoneyBottle(fx);
    expect(r.map((e) => e.id)).toEqual(['speed']);
  });

  it('honey idempotent when no poison', () => {
    const e: Effect[] = [{ id: 'speed', level: 1, durationTicks: 100, beneficial: true }];
    expect(drinkHoneyBottle(e)).toEqual(e);
  });
});
