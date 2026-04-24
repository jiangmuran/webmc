import { describe, it, expect } from 'vitest';
import {
  pickUpStack,
  halfStack,
  placeOne,
  type Stack,
  type CursorState,
} from './inventory_cursor_held_item';

const apple: Stack = { id: 'apple', count: 5, maxStack: 64 };
const cursorFull: CursorState = { held: { id: 'apple', count: 3, maxStack: 64 } };

describe('inventory cursor held item', () => {
  it('picks stack from slot', () => {
    const r = pickUpStack({}, apple);
    expect(r.cursor.held).toBe(apple);
  });

  it('halves stack', () => {
    const r = halfStack(apple);
    expect(r.right.count + (r.left?.count ?? 0)).toBe(apple.count);
  });

  it('place one into empty', () => {
    const r = placeOne(cursorFull, undefined);
    expect(r.slotAfter?.count).toBe(1);
    expect(r.cursor.held?.count).toBe(2);
  });

  it('place one merges stack', () => {
    const r = placeOne(cursorFull, { id: 'apple', count: 5, maxStack: 64 });
    expect(r.slotAfter?.count).toBe(6);
  });

  it('cannot place mismatch', () => {
    const r = placeOne(cursorFull, { id: 'stone', count: 5, maxStack: 64 });
    expect(r.slotAfter).toBeUndefined();
  });

  it('empty cursor noop', () => {
    const r = placeOne({}, undefined);
    expect(r.slotAfter).toBeUndefined();
  });
});
