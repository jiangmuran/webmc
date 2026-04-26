import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { AIR, makeState } from '@/blocks/state';
import { CHUNK_HEIGHT } from './Chunk';
import { World, chunkKey, chunkXOf, chunkZOf, localXOf, localZOf } from './World';

const STONE = makeState(1, 0);
const DIRT = makeState(2, 0);

describe('World coordinate math', () => {
  it('chunkXOf/localXOf partitions non-negative world-x into (cx, lx)', () => {
    for (let wx = 0; wx < 64; wx++) {
      expect(chunkXOf(wx) * 16 + localXOf(wx)).toBe(wx);
      expect(localXOf(wx)).toBeGreaterThanOrEqual(0);
      expect(localXOf(wx)).toBeLessThan(16);
    }
  });

  it('chunkXOf/localXOf partitions negative world-x correctly', () => {
    for (let wx = -64; wx < 0; wx++) {
      expect(chunkXOf(wx) * 16 + localXOf(wx)).toBe(wx);
      expect(localXOf(wx)).toBeGreaterThanOrEqual(0);
      expect(localXOf(wx)).toBeLessThan(16);
    }
  });

  it('property: (cx*16 + lx) reassembles any integer world-x', () => {
    fc.assert(
      fc.property(fc.integer({ min: -1_000_000, max: 1_000_000 }), (wx) => {
        expect(chunkXOf(wx) * 16 + localXOf(wx)).toBe(wx);
      }),
    );
  });

  it('chunkZOf/localZOf analogously for z', () => {
    fc.assert(
      fc.property(fc.integer({ min: -1_000_000, max: 1_000_000 }), (wz) => {
        expect(chunkZOf(wz) * 16 + localZOf(wz)).toBe(wz);
      }),
    );
  });

  it('chunkKey is deterministic and unique per (cx, cz)', () => {
    // Numeric pack — was a string `cx,cz` before; now a 32-bit unsigned
    // for allocation-free Map keys. Determinism + uniqueness preserved.
    expect(chunkKey(0, 0)).toBe(chunkKey(0, 0));
    expect(chunkKey(-3, 5)).toBe(chunkKey(-3, 5));
    expect(chunkKey(1, 2)).not.toBe(chunkKey(2, 1));
    expect(chunkKey(0, 0)).not.toBe(chunkKey(1, 0));
    expect(chunkKey(0, 0)).not.toBe(chunkKey(0, 1));
  });
});

describe('World', () => {
  it('is empty on construction', () => {
    const w = new World();
    expect(w.chunkCount).toBe(0);
    expect(w.get(0, 50, 0)).toBe(AIR);
    expect(w.has(0, 0)).toBe(false);
  });

  it('set on a non-air block allocates the chunk lazily', () => {
    const w = new World();
    w.set(5, 60, 9, STONE);
    expect(w.has(0, 0)).toBe(true);
    expect(w.get(5, 60, 9)).toBe(STONE);
  });

  it('set AIR in an unloaded chunk does not allocate', () => {
    const w = new World();
    w.set(100, 60, 100, AIR);
    expect(w.has(chunkXOf(100), chunkZOf(100))).toBe(false);
    expect(w.chunkCount).toBe(0);
  });

  it('crossing chunk borders uses separate chunks', () => {
    const w = new World();
    w.set(-1, 50, 0, STONE);
    w.set(0, 50, 0, DIRT);
    expect(w.has(-1, 0)).toBe(true);
    expect(w.has(0, 0)).toBe(true);
    expect(w.get(-1, 50, 0)).toBe(STONE);
    expect(w.get(0, 50, 0)).toBe(DIRT);
  });

  it('y out of range: get returns AIR, set throws', () => {
    const w = new World();
    expect(w.get(0, -1, 0)).toBe(AIR);
    expect(w.get(0, CHUNK_HEIGHT, 0)).toBe(AIR);
    expect(() => {
      w.set(0, -1, 0, STONE);
    }).toThrow(RangeError);
    expect(() => {
      w.set(0, CHUNK_HEIGHT, 0, STONE);
    }).toThrow(RangeError);
  });

  it('removeChunk drops state and returns true when present', () => {
    const w = new World();
    w.set(0, 0, 0, STONE);
    expect(w.removeChunk(0, 0)).toBe(true);
    expect(w.has(0, 0)).toBe(false);
    expect(w.get(0, 0, 0)).toBe(AIR);
    expect(w.removeChunk(0, 0)).toBe(false);
  });

  it('chunks() iterates exactly the loaded chunks', () => {
    const w = new World();
    w.set(0, 0, 0, STONE);
    w.set(16, 0, 0, STONE);
    w.set(-1, 0, -1, STONE);
    const keys = new Set(Array.from(w.chunks()).map((c) => chunkKey(c.cx, c.cz)));
    expect(keys).toEqual(new Set([chunkKey(0, 0), chunkKey(1, 0), chunkKey(-1, -1)]));
  });
});
