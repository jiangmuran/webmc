import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { AIR, makeState } from '@/blocks/state';
import { Palette } from './Palette';

describe('Palette', () => {
  it('starts with a single AIR entry', () => {
    const p = new Palette();
    expect(p.size).toBe(1);
    expect(p.get(0)).toBe(AIR);
    expect(p.indexOf(AIR)).toBe(0);
    expect(p.bitsPerIndex).toBe(0);
  });

  it('adding returns sequential indices for new states', () => {
    const p = new Palette();
    const a = p.add(makeState(1, 0));
    const b = p.add(makeState(2, 0));
    expect(a).toBe(1);
    expect(b).toBe(2);
    expect(p.size).toBe(3);
  });

  it('adding an existing state is idempotent', () => {
    const p = new Palette();
    const s = makeState(5, 0);
    const first = p.add(s);
    const second = p.add(s);
    expect(first).toBe(second);
    expect(p.size).toBe(2);
  });

  it('bitsPerIndex grows 0 → 4 → 8 → 16 as the palette grows', () => {
    const p = new Palette();
    expect(p.bitsPerIndex).toBe(0);
    for (let i = 1; i <= 15; i++) p.add(makeState(i, 0));
    expect(p.size).toBe(16);
    expect(p.bitsPerIndex).toBe(4);
    for (let i = 16; i <= 255; i++) p.add(makeState(i, 0));
    expect(p.size).toBe(256);
    expect(p.bitsPerIndex).toBe(8);
    p.add(makeState(1, 1));
    expect(p.bitsPerIndex).toBe(16);
  });

  it('indexOf returns -1 for states not in the palette', () => {
    const p = new Palette();
    expect(p.indexOf(makeState(42, 0))).toBe(-1);
  });

  it('throws on out-of-range get', () => {
    const p = new Palette();
    expect(() => p.get(999)).toThrow(/no entry/);
  });

  it('property: any sequence of adds leaves indexOf consistent with add return', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 1, max: 1000 }), { minLength: 1, maxLength: 200 }),
        (ids) => {
          const p = new Palette();
          const seen = new Map<number, number>();
          for (const id of ids) {
            const state = makeState(id, 0);
            const returned = p.add(state);
            if (seen.has(state)) {
              expect(returned).toBe(seen.get(state));
            } else {
              seen.set(state, returned);
            }
            expect(p.indexOf(state)).toBe(returned);
          }
        },
      ),
      { numRuns: 30 },
    );
  });

  it('clone is independent of the source', () => {
    const p = new Palette();
    p.add(makeState(1, 0));
    const q = p.clone();
    q.add(makeState(2, 0));
    expect(p.size).toBe(2);
    expect(q.size).toBe(3);
  });
});
