import { describe, it, expect } from 'vitest';
import { makeDrag, startDrag, hoverSlot, commitDrag, type Slot } from './inventory_drag_split';

function emptySlots(n: number): Slot[] {
  return Array.from({ length: n }, () => ({ id: null, count: 0 }));
}

describe('drag split', () => {
  it('left distributes evenly', () => {
    const d = makeDrag();
    startDrag(d, 'left', 'webmc:dirt', 64);
    hoverSlot(d, 0);
    hoverSlot(d, 1);
    hoverSlot(d, 2);
    const r = commitDrag(d, 64, emptySlots(3));
    expect(r.slotUpdates.map((u) => u.add)).toEqual([21, 21, 21]);
    expect(r.heldCountAfter).toBe(1);
  });

  it('right places 1 each', () => {
    const d = makeDrag();
    startDrag(d, 'right', 'webmc:dirt', 10);
    hoverSlot(d, 0);
    hoverSlot(d, 1);
    hoverSlot(d, 2);
    const r = commitDrag(d, 64, emptySlots(3));
    expect(r.slotUpdates.map((u) => u.add)).toEqual([1, 1, 1]);
    expect(r.heldCountAfter).toBe(7);
  });

  it('ignores incompatible slots', () => {
    const d = makeDrag();
    startDrag(d, 'left', 'webmc:dirt', 10);
    hoverSlot(d, 0);
    hoverSlot(d, 1);
    const slots: Slot[] = [
      { id: null, count: 0 },
      { id: 'webmc:stone', count: 10 },
    ];
    const r = commitDrag(d, 64, slots);
    expect(r.slotUpdates.length).toBe(1);
  });

  it('no targets → no change', () => {
    const d = makeDrag();
    startDrag(d, 'left', 'webmc:dirt', 10);
    const r = commitDrag(d, 64, emptySlots(3));
    expect(r.slotUpdates).toEqual([]);
  });
});
