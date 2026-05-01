import { describe, it, expect } from 'vitest';
import {
  countEffectiveBookshelves,
  maxEnchantmentLevel,
  MAX_BOOKSHELVES,
} from './enchanting_bookshelf_power';

describe('enchanting bookshelf power', () => {
  it('empty → 0', () => {
    expect(countEffectiveBookshelves([])).toBe(0);
  });

  it('out-of-range ignored', () => {
    const r = countEffectiveBookshelves([{ dx: 5, dy: 0, dz: 0, hasAir: true }]);
    expect(r).toBe(0);
  });

  it('inner 3×3 ring does NOT count (wiki: perimeter only)', () => {
    // Wiki: only the 5×5 perimeter (max(|dx|,|dz|) === 2) is valid;
    // the inner 3×3 must be empty/walkable.
    expect(countEffectiveBookshelves([{ dx: 1, dy: 0, dz: 0, hasAir: true }])).toBe(0);
    expect(countEffectiveBookshelves([{ dx: 0, dy: 1, dz: 1, hasAir: true }])).toBe(0);
    expect(countEffectiveBookshelves([{ dx: 1, dy: 0, dz: 1, hasAir: true }])).toBe(0);
  });

  it('5×5 perimeter corner + edge counts', () => {
    expect(countEffectiveBookshelves([{ dx: 2, dy: 0, dz: 2, hasAir: true }])).toBe(1);
    expect(countEffectiveBookshelves([{ dx: 2, dy: 1, dz: 0, hasAir: true }])).toBe(1);
    expect(countEffectiveBookshelves([{ dx: -2, dy: 0, dz: 1, hasAir: true }])).toBe(1);
  });

  it('blocked by obstruction', () => {
    const r = countEffectiveBookshelves([{ dx: 2, dy: 0, dz: 0, hasAir: false }]);
    expect(r).toBe(0);
  });

  it('caps at 15', () => {
    const many: { dx: number; dy: number; dz: number; hasAir: boolean }[] = [];
    for (let i = 0; i < 30; i++) many.push({ dx: 2, dy: 0, dz: i % 3, hasAir: true });
    expect(countEffectiveBookshelves(many)).toBe(MAX_BOOKSHELVES);
  });

  it('level 30 with 15 shelves', () => {
    expect(maxEnchantmentLevel(15)).toBe(30);
  });

  it('level floor 1', () => {
    expect(maxEnchantmentLevel(0)).toBe(1);
  });
});
