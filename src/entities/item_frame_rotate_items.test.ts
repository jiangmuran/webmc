import { describe, it, expect } from 'vitest';
import { rotate, comparatorOutput, arrowDropsItem, ROTATIONS } from './item_frame_rotate_items';

describe('item frame rotate items', () => {
  it('rotates sequentially', () => {
    expect(rotate({ rotationIndex: 0, isGlow: false }).rotationIndex).toBe(1);
  });

  it('wraps around', () => {
    expect(rotate({ rotationIndex: ROTATIONS - 1, isGlow: false }).rotationIndex).toBe(0);
  });

  it('comparator 0 when empty', () => {
    expect(comparatorOutput({ rotationIndex: 3, isGlow: false })).toBe(0);
  });

  it('comparator based on rotation+1', () => {
    expect(comparatorOutput({ rotationIndex: 3, heldItem: 'sword', isGlow: false })).toBe(4);
  });

  it('arrow drops held item', () => {
    expect(arrowDropsItem({ rotationIndex: 0, heldItem: 'apple', isGlow: false })).toBe('apple');
  });
});
