import { describe, it, expect } from 'vitest';
import { moveOne, pickupEntity, firstNonEmpty, firstSlotAccepting } from './hopper_pull_push';

function box(slots: (string | null)[], counts: number[] = []) {
  return {
    slots: slots.map((id, i) => (id ? { id, count: counts[i] ?? 1 } : null)),
  };
}

describe('hopper transfer', () => {
  it('moves one item', () => {
    const a = box(['webmc:stone', null, null], [5]);
    const b = box([null, null, null]);
    expect(moveOne(a, b)).toBe(true);
    expect(a.slots[0]?.count).toBe(4);
    expect(b.slots[0]?.count).toBe(1);
  });

  it('from empty = false', () => {
    const a = box([null, null]);
    const b = box([null, null]);
    expect(moveOne(a, b)).toBe(false);
  });

  it('stack limit prevents', () => {
    const a = box(['webmc:stone'], [1]);
    const b = box(['webmc:stone'], [64]);
    expect(moveOne(a, b, 64)).toBe(false);
  });

  it('pickup item entity', () => {
    const h = box([null, null]);
    const e = { id: 'webmc:stone', count: 5 };
    expect(pickupEntity(h, e)).toBe(true);
    expect(h.slots[0]?.count).toBe(5);
    expect(e.count).toBe(0);
  });

  it('finders', () => {
    const c = box(['webmc:a', null, 'webmc:b'], [1, 0, 1]);
    expect(firstNonEmpty(c)).toBe(0);
    expect(firstSlotAccepting(c, 'webmc:a')).toBe(0);
    expect(firstSlotAccepting(c, 'webmc:c')).toBe(1);
  });
});
