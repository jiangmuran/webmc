import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { AIR, makeState } from '@/blocks/state';
import { SUBCHUNK_DIM, SUBCHUNK_VOLUME, SubChunk, localIndex } from './SubChunk';

const STONE = makeState(1, 0);
const DIRT = makeState(2, 0);
const GRASS = makeState(3, 0);

describe('SubChunk', () => {
  it('is all air when default-constructed, single-block encoded', () => {
    const s = new SubChunk();
    expect(s.isUniform).toBe(true);
    expect(s.bitsPerIndex).toBe(0);
    expect(s.get(0, 0, 0)).toBe(AIR);
    expect(s.get(15, 15, 15)).toBe(AIR);
    expect(s.nonAirCount).toBe(0);
    expect(s.version).toBe(0);
  });

  it('setting the same uniform state does nothing (no version bump)', () => {
    const s = new SubChunk(STONE);
    expect(s.nonAirCount).toBe(SUBCHUNK_VOLUME);
    s.set(3, 3, 3, STONE);
    expect(s.version).toBe(0);
  });

  it('set/get round-trips over many cells', () => {
    const s = new SubChunk();
    s.set(0, 0, 0, STONE);
    s.set(15, 15, 15, DIRT);
    s.set(5, 7, 11, GRASS);
    expect(s.get(0, 0, 0)).toBe(STONE);
    expect(s.get(15, 15, 15)).toBe(DIRT);
    expect(s.get(5, 7, 11)).toBe(GRASS);
    expect(s.get(1, 1, 1)).toBe(AIR);
    expect(s.version).toBe(3);
  });

  it('grows from 0 → 4 → 8 → 16 bits as palette fills', () => {
    const s = new SubChunk();
    s.set(0, 0, 0, STONE);
    expect(s.bitsPerIndex).toBe(4);
    for (let id = 2; id <= 16; id++) s.set(0, 0, id - 1, makeState(id, 0));
    expect(s.palette.size).toBe(17);
    expect(s.bitsPerIndex).toBe(8);
    for (let id = 17; id <= 256; id++) s.set(0, 1, (id - 17) & 15, makeState(id, 0));
    expect(s.bitsPerIndex).toBe(16);
    expect(s.get(0, 0, 0)).toBe(STONE);
  });

  it('fill replaces all contents and collapses to 0 bits', () => {
    const s = new SubChunk();
    s.set(0, 0, 0, STONE);
    s.set(1, 1, 1, DIRT);
    expect(s.isUniform).toBe(false);
    s.fill(GRASS);
    expect(s.isUniform).toBe(true);
    expect(s.nonAirCount).toBe(SUBCHUNK_VOLUME);
    expect(s.get(0, 0, 0)).toBe(GRASS);
    expect(s.get(7, 7, 7)).toBe(GRASS);
  });

  it('nonAir count updates correctly on air↔solid transitions', () => {
    const s = new SubChunk();
    s.set(0, 0, 0, STONE);
    expect(s.nonAirCount).toBe(1);
    s.set(0, 0, 0, AIR);
    expect(s.nonAirCount).toBe(0);
    s.set(1, 1, 1, STONE);
    s.set(1, 1, 1, DIRT);
    expect(s.nonAirCount).toBe(1);
  });

  it('rejects out-of-range coords', () => {
    const s = new SubChunk();
    expect(() => s.get(16, 0, 0)).toThrow(RangeError);
    expect(() => {
      s.set(-1, 0, 0, STONE);
    }).toThrow(RangeError);
    expect(() => s.get(0, 100, 0)).toThrow(RangeError);
  });

  it('localIndex is a bijection over the subchunk volume', () => {
    const seen = new Set<number>();
    for (let y = 0; y < SUBCHUNK_DIM; y++) {
      for (let z = 0; z < SUBCHUNK_DIM; z++) {
        for (let x = 0; x < SUBCHUNK_DIM; x++) {
          const i = localIndex(x, y, z);
          expect(seen.has(i)).toBe(false);
          seen.add(i);
        }
      }
    }
    expect(seen.size).toBe(SUBCHUNK_VOLUME);
  });

  it('property: any sequence of sets yields a correct read for every touched cell', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.tuple(
            fc.integer({ min: 0, max: 15 }),
            fc.integer({ min: 0, max: 15 }),
            fc.integer({ min: 0, max: 15 }),
            fc.integer({ min: 0, max: 20 }),
          ),
          { minLength: 1, maxLength: 400 },
        ),
        (ops) => {
          const s = new SubChunk();
          const mirror = new Map<number, number>();
          for (const [x, y, z, id] of ops) {
            const state = makeState(id, 0);
            s.set(x, y, z, state);
            mirror.set(localIndex(x, y, z), state);
          }
          for (const [pos, state] of mirror) {
            const x = pos & 15;
            const z = (pos >> 4) & 15;
            const y = (pos >> 8) & 15;
            expect(s.get(x, y, z)).toBe(state);
          }
        },
      ),
      { numRuns: 20 },
    );
  });
});
