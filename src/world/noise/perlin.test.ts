import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { Perlin, hash32 } from './perlin';

describe('Perlin', () => {
  it('is deterministic for a given seed', () => {
    const a = new Perlin(42);
    const b = new Perlin(42);
    fc.assert(
      fc.property(
        fc.float({ min: Math.fround(-500), max: Math.fround(500), noNaN: true }),
        fc.float({ min: Math.fround(-500), max: Math.fround(500), noNaN: true }),
        (x, z) => {
          expect(a.noise2(x, z)).toBe(b.noise2(x, z));
        },
      ),
    );
  });

  it('different seeds produce different outputs at most points', () => {
    const a = new Perlin(1);
    const b = new Perlin(2);
    let diffs = 0;
    for (let i = 0; i < 100; i++) {
      if (a.noise2(i * 0.37, i * 0.59) !== b.noise2(i * 0.37, i * 0.59)) diffs++;
    }
    expect(diffs).toBeGreaterThan(80);
  });

  it('noise2 output is roughly in [-1, 1]', () => {
    const n = new Perlin(7);
    let min = Infinity;
    let max = -Infinity;
    for (let i = 0; i < 1000; i++) {
      for (let j = 0; j < 10; j++) {
        const v = n.noise2(i * 0.11, j * 0.29);
        if (v < min) min = v;
        if (v > max) max = v;
      }
    }
    expect(min).toBeGreaterThan(-1.2);
    expect(max).toBeLessThan(1.2);
  });

  it('fbm combines octaves and stays in [-1, 1] range', () => {
    const n = new Perlin(13);
    let min = Infinity;
    let max = -Infinity;
    for (let i = 0; i < 500; i++) {
      const v = n.fbm2(i * 0.03, i * 0.05, 4);
      if (v < min) min = v;
      if (v > max) max = v;
    }
    expect(min).toBeGreaterThan(-1.2);
    expect(max).toBeLessThan(1.2);
  });

  it('integer-lattice points return exactly zero (Perlin property)', () => {
    const n = new Perlin(99);
    for (let x = -5; x <= 5; x++) {
      for (let z = -5; z <= 5; z++) {
        expect(n.noise2(x, z)).toBeCloseTo(0, 10);
      }
    }
  });

  it('noise3 is also deterministic', () => {
    const a = new Perlin(42);
    const b = new Perlin(42);
    for (let i = 0; i < 50; i++) {
      expect(a.noise3(i, i * 0.5, i * 0.25)).toBe(b.noise3(i, i * 0.5, i * 0.25));
    }
  });
});

describe('hash32', () => {
  it('is deterministic for (x, z, seed)', () => {
    expect(hash32(5, 7, 42)).toBe(hash32(5, 7, 42));
  });
  it('distributes reasonably well across a small grid', () => {
    const seen = new Set<number>();
    for (let x = 0; x < 16; x++) {
      for (let z = 0; z < 16; z++) seen.add(hash32(x, z, 42));
    }
    expect(seen.size).toBeGreaterThan(250);
  });
});
