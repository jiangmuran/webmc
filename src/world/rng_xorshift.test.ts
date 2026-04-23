import { describe, it, expect } from 'vitest';
import { makeRNG, next01, nextInt, nextRange } from './rng_xorshift';

describe('rng xorshift', () => {
  it('same seed same sequence', () => {
    const a = makeRNG(42);
    const b = makeRNG(42);
    for (let i = 0; i < 10; i++) expect(next01(a)).toBe(next01(b));
  });

  it('different seeds diverge', () => {
    const a = makeRNG(1);
    const b = makeRNG(2);
    expect(next01(a)).not.toBe(next01(b));
  });

  it('0..1 range', () => {
    const r = makeRNG(7);
    for (let i = 0; i < 100; i++) {
      const v = next01(r);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it('nextInt bounds', () => {
    const r = makeRNG(99);
    for (let i = 0; i < 50; i++) {
      const v = nextInt(r, 10);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(10);
    }
  });

  it('string seed deterministic', () => {
    const a = makeRNG('webmc');
    const b = makeRNG('webmc');
    expect(next01(a)).toBe(next01(b));
  });

  it('nextRange', () => {
    const r = makeRNG(5);
    const v = nextRange(r, 10, 20);
    expect(v).toBeGreaterThanOrEqual(10);
    expect(v).toBeLessThan(20);
  });
});
