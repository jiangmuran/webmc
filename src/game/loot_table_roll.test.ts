import { describe, it, expect } from 'vitest';
import { pickOne, rollCount } from './loot_table_roll';

const entries = [
  { item: 'diamond', weight: 1, countMin: 1, countMax: 1 },
  { item: 'iron', weight: 99, countMin: 1, countMax: 3 },
];

describe('loot table roll', () => {
  it('common item usually', () => {
    expect(pickOne(entries, () => 0.5)?.item).toBe('iron');
  });

  it('rare item on low rng', () => {
    expect(pickOne(entries, () => 0)?.item).toBe('diamond');
  });

  it('empty table undefined', () => {
    expect(pickOne([], () => 0.5)).toBeUndefined();
  });

  it('count in range', () => {
    const n = rollCount({ item: 'x', weight: 1, countMin: 1, countMax: 5 }, () => 0.5);
    expect(n).toBeGreaterThanOrEqual(1);
    expect(n).toBeLessThanOrEqual(5);
  });
});
