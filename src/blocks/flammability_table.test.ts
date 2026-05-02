import { describe, it, expect } from 'vitest';
import { flammabilityOf, isFlammable, burnoutChance } from './flammability_table';

describe('flammability table', () => {
  it('oak planks flammable', () => {
    expect(flammabilityOf('oak_planks').flammability).toBe(20);
  });

  it('stone not flammable', () => {
    expect(isFlammable('stone')).toBe(false);
  });

  it('unknown default not flammable', () => {
    expect(isFlammable('magic')).toBe(false);
  });

  it('burnout chance 0-1', () => {
    expect(burnoutChance('tnt')).toBeCloseTo(1);
    expect(burnoutChance('oak_log')).toBeLessThan(1);
  });

  it('wool flammable', () => {
    expect(isFlammable('wool')).toBe(true);
  });

  it('bookshelf flammable (canonical id, no underscore)', () => {
    // Wiki: bookshelves catch fire (encouragement 30, flammability 20).
    // The block ID is `bookshelf` (one word) — old table had
    // `book_shelf` so the lookup silently returned 0/0.
    expect(isFlammable('bookshelf')).toBe(true);
    expect(flammabilityOf('bookshelf').encouragement).toBe(30);
    expect(flammabilityOf('bookshelf').flammability).toBe(20);
  });
});
