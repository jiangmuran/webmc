import { describe, it, expect } from 'vitest';
import { addSlot, finalizeDrag, makeDragState, startDrag } from './inventory_drag';

describe('inventory drag', () => {
  it('split even distributes', () => {
    const s = makeDragState();
    startDrag(s, 'split_even', { item: 'webmc:dirt', count: 60, damage: 0 });
    addSlot(s, 0);
    addSlot(s, 1);
    addSlot(s, 2);
    const r = finalizeDrag(s, 64);
    expect(r.allocations.length).toBe(3);
    for (const a of r.allocations) expect(a.count).toBe(20);
    expect(r.carriedRemaining).toBe(0);
  });

  it('single per slot = 1 each', () => {
    const s = makeDragState();
    startDrag(s, 'single_per_slot', { item: 'webmc:dirt', count: 60, damage: 0 });
    addSlot(s, 0);
    addSlot(s, 1);
    const r = finalizeDrag(s, 64);
    expect(r.allocations.every((a) => a.count === 1)).toBe(true);
    expect(r.carriedRemaining).toBe(58);
  });

  it('fill creative = stacks preserved', () => {
    const s = makeDragState();
    startDrag(s, 'fill_creative', { item: 'webmc:dirt', count: 1, damage: 0 });
    addSlot(s, 0);
    const r = finalizeDrag(s, 64);
    expect(r.allocations[0]?.count).toBe(64);
    expect(r.carriedRemaining).toBe(1);
  });

  it('duplicate slot ignored', () => {
    const s = makeDragState();
    startDrag(s, 'split_even', { item: 'webmc:dirt', count: 10, damage: 0 });
    addSlot(s, 0);
    expect(addSlot(s, 0)).toBe(false);
  });

  it('empty drag = nothing allocated', () => {
    const s = makeDragState();
    startDrag(s, 'split_even', { item: 'webmc:dirt', count: 10, damage: 0 });
    expect(finalizeDrag(s, 64).allocations).toEqual([]);
  });

  it('split with too few items returns nothing', () => {
    const s = makeDragState();
    startDrag(s, 'split_even', { item: 'webmc:dirt', count: 2, damage: 0 });
    addSlot(s, 0);
    addSlot(s, 1);
    addSlot(s, 2);
    const r = finalizeDrag(s, 64);
    expect(r.allocations.length).toBe(0);
    expect(r.carriedRemaining).toBe(2);
  });
});
