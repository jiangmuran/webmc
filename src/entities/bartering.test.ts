import { describe, it, expect } from 'vitest';
import { BARTERING_TABLE, BARTERING_TOTAL_WEIGHT, rollBarter, rollCount } from './bartering';

describe('bartering', () => {
  it('has 19 entries with positive weight (wiki Java table)', () => {
    expect(BARTERING_TABLE.length).toBe(19);
    for (const d of BARTERING_TABLE) expect(d.weight).toBeGreaterThan(0);
  });

  it('total weight = 469 (wiki Java)', () => {
    const sum = BARTERING_TABLE.reduce((s, d) => s + d.weight, 0);
    expect(sum).toBe(BARTERING_TOTAL_WEIGHT);
    expect(sum).toBe(469);
  });

  it('rollBarter returns a valid drop with fixed rng', () => {
    const drop = rollBarter(() => 0);
    expect(drop.item).toBeTruthy();
    expect(drop.minCount).toBeGreaterThan(0);
    expect(drop.maxCount).toBeGreaterThanOrEqual(drop.minCount);
  });

  it('rolls across full weight distribution', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 5000; i++) seen.add(rollBarter().item);
    expect(seen.size).toBeGreaterThan(5);
  });

  it('common drops appear more often than rare ones', () => {
    const counts = new Map<string, number>();
    for (let i = 0; i < 5000; i++) {
      const d = rollBarter();
      counts.set(d.item, (counts.get(d.item) ?? 0) + 1);
    }
    const gravel = counts.get('webmc:gravel') ?? 0;
    const book = counts.get('webmc:enchanted_book_soul_speed') ?? 0;
    expect(gravel).toBeGreaterThan(book);
  });

  it('rollCount stays within [min,max]', () => {
    const ironNugget = BARTERING_TABLE.find((d) => d.item === 'webmc:iron_nugget')!;
    expect(rollCount(ironNugget, () => 0)).toBe(10);
    expect(rollCount(ironNugget, () => 0.999999)).toBe(36);
    for (let i = 0; i < 100; i++) {
      const c = rollCount(ironNugget, Math.random);
      expect(c).toBeGreaterThanOrEqual(10);
      expect(c).toBeLessThanOrEqual(36);
    }
  });

  it('table includes wiki entries that were missing in older table', () => {
    const ids = new Set(BARTERING_TABLE.map((d) => d.item));
    expect(ids.has('webmc:dried_ghast')).toBe(true);
    expect(ids.has('webmc:water_bottle')).toBe(true);
    expect(ids.has('webmc:string')).toBe(true);
    expect(ids.has('webmc:spectral_arrow')).toBe(true);
    expect(ids.has('webmc:blackstone')).toBe(true);
  });
});
