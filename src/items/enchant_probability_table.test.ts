import { describe, it, expect } from 'vitest';
import { pickFromTable, pickLevel, ENCHANT_TABLE } from './enchant_probability_table';

describe('enchant probability table', () => {
  it('non-empty table', () => {
    expect(ENCHANT_TABLE.length).toBeGreaterThan(0);
  });

  it('picks some enchant', () => {
    expect(pickFromTable(() => 0.5)).toBeDefined();
  });

  it('filter can narrow', () => {
    const only = pickFromTable(
      () => 0.5,
      (e) => e.id === 'mending',
    );
    expect(only?.id).toBe('mending');
  });

  it('empty filter undefined', () => {
    expect(
      pickFromTable(
        () => 0.5,
        () => false,
      ),
    ).toBeUndefined();
  });

  it('level in range', () => {
    const e = ENCHANT_TABLE[0];
    if (e === undefined) throw new Error('table empty');
    const l = pickLevel(e, () => 0.5);
    expect(l).toBeGreaterThanOrEqual(e.minLevel);
    expect(l).toBeLessThanOrEqual(e.maxLevel);
  });
});
