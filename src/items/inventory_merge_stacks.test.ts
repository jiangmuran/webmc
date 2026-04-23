import { describe, it, expect } from 'vitest';
import { addToInventory, consume, type Stack } from './inventory_merge_stacks';

const apple: Stack = { id: 'apple', count: 5, maxStack: 64 };

describe('inventory merge stacks', () => {
  it('stacks on existing', () => {
    const r = addToInventory([apple, undefined], {
      id: 'apple',
      count: 10,
      maxStack: 64,
    });
    expect(r.slots[0]?.count).toBe(15);
    expect(r.overflow).toBe(0);
  });

  it('overflow to empty', () => {
    const r = addToInventory([{ id: 'apple', count: 60, maxStack: 64 }, undefined], {
      id: 'apple',
      count: 20,
      maxStack: 64,
    });
    expect(r.slots[1]?.count).toBe(16);
  });

  it('full inventory overflows', () => {
    const r = addToInventory(
      [
        { id: 'apple', count: 64, maxStack: 64 },
        { id: 'stone', count: 64, maxStack: 64 },
      ],
      { id: 'apple', count: 10, maxStack: 64 },
    );
    expect(r.overflow).toBe(10);
  });

  it('consume across slots', () => {
    const r = consume(
      [
        { id: 'apple', count: 3, maxStack: 64 },
        { id: 'apple', count: 5, maxStack: 64 },
      ],
      'apple',
      7,
    );
    expect(r.consumed).toBe(7);
    const total = r.slots.reduce((s, x) => s + (x?.count ?? 0), 0);
    expect(total).toBe(1);
  });

  it('consume missing', () => {
    expect(consume([undefined], 'apple', 1).consumed).toBe(0);
  });
});
