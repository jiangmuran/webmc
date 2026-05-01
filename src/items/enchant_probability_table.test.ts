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

  it('default selector excludes treasure (mending) per wiki', () => {
    // Wiki minecraft.wiki/w/Enchanting_mechanics: mending is treasure-
    // only — never appears from the enchanting table. Sample many
    // rolls; mending must NOT appear with the default no-filter call.
    const seen = new Set<string>();
    for (let i = 0; i < 200; i++) {
      const e = pickFromTable(() => i / 200);
      if (e) seen.add(e.id);
    }
    expect(seen.has('mending')).toBe(false);
  });

  it('explicit treasure filter can include mending (loot/trade paths)', () => {
    // Loot tables / villager trades opt in to treasure draws.
    const onlyMending = pickFromTable(
      () => 0.5,
      (e) => e.id === 'mending',
    );
    expect(onlyMending?.id).toBe('mending');
  });
});
