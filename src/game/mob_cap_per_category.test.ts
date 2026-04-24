import { describe, it, expect } from 'vitest';
import { scaledCap, canSpawnMore } from './mob_cap_per_category';

describe('mob cap per category', () => {
  it('vanilla chunk count → vanilla cap', () => {
    expect(scaledCap('monster', 289)).toBe(70);
  });

  it('scales with chunks', () => {
    const half = scaledCap('monster', 144);
    const full = scaledCap('monster', 289);
    expect(half).toBeLessThan(full);
  });

  it('can spawn below cap', () => {
    expect(canSpawnMore('monster', 5, 289)).toBe(true);
  });

  it('cannot spawn at cap', () => {
    expect(canSpawnMore('monster', 70, 289)).toBe(false);
  });

  it('different categories differ', () => {
    expect(scaledCap('monster', 289)).toBeGreaterThan(scaledCap('creature', 289));
  });
});
