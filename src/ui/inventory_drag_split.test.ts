import { describe, it, expect } from 'vitest';
import { splitEvenlyAcrossSlots, placeOnePerSlot } from './inventory_drag_split';

describe('inventory drag split', () => {
  it('splits 30 across 3 empty', () => {
    const r = splitEvenlyAcrossSlots(30, 'stone', 64, [
      { id: null, count: 0, maxStack: 64 },
      { id: null, count: 0, maxStack: 64 },
      { id: null, count: 0, maxStack: 64 },
    ]);
    expect(r.perSlot).toBe(10);
    expect(r.remainder).toBe(0);
  });

  it('remainder kept', () => {
    const r = splitEvenlyAcrossSlots(10, 'stone', 64, [
      { id: null, count: 0, maxStack: 64 },
      { id: null, count: 0, maxStack: 64 },
      { id: null, count: 0, maxStack: 64 },
    ]);
    expect(r.perSlot).toBe(3);
    expect(r.remainder).toBe(1);
  });

  it('skips mismatched slot', () => {
    const r = splitEvenlyAcrossSlots(10, 'stone', 64, [{ id: 'dirt', count: 5, maxStack: 64 }]);
    expect(r.perSlot).toBe(0);
    expect(r.remainder).toBe(10);
  });

  it('right drag places 1 each', () => {
    expect(
      placeOnePerSlot(5, [
        { id: null, count: 0, maxStack: 64 },
        { id: null, count: 0, maxStack: 64 },
        { id: null, count: 0, maxStack: 64 },
      ]),
    ).toBe(3);
  });
});
