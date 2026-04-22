import { describe, it, expect } from 'vitest';
import { BARTERING_TABLE, rollBarter } from './bartering';

describe('bartering', () => {
  it('has 10+ drops with positive weight', () => {
    expect(BARTERING_TABLE.length).toBeGreaterThanOrEqual(10);
    for (const d of BARTERING_TABLE) expect(d.weight).toBeGreaterThan(0);
  });

  it('rollBarter returns a valid drop with fixed rng', () => {
    const drop = rollBarter(() => 0);
    expect(drop.item).toBeTruthy();
    expect(drop.count).toBeGreaterThan(0);
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
});
