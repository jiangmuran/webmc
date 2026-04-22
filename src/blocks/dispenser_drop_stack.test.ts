import { describe, it, expect } from 'vitest';
import { dispense, type DispenserSlot } from './dispenser_drop_stack';

function slots(pairs: [string, number][]): DispenserSlot[] {
  const out: DispenserSlot[] = Array.from({ length: 9 }, () => ({ item: null }));
  pairs.forEach(([id, c], idx) => {
    out[idx] = { item: { id, count: c } };
  });
  return out;
}

describe('dispenser', () => {
  it('empty returns empty', () => {
    const r = dispense({ slots: slots([]), rand: () => 0 });
    expect(r.action).toBe('empty');
  });

  it('drops a block item', () => {
    const s = slots([['webmc:stone', 1]]);
    const r = dispense({ slots: s, rand: () => 0 });
    expect(r.action).toBe('drop');
    expect(r.item?.id).toBe('webmc:stone');
    expect(s[0]?.item).toBeNull();
  });

  it('activates an arrow', () => {
    const s = slots([['webmc:arrow', 3]]);
    const r = dispense({ slots: s, rand: () => 0 });
    expect(r.action).toBe('activate');
    expect(s[0]?.item?.count).toBe(2);
  });

  it('picks by random', () => {
    const s = slots([
      ['webmc:a', 1],
      ['webmc:b', 1],
    ]);
    const r = dispense({ slots: s, rand: () => 0.99 });
    expect(r.slotIndex).toBe(1);
  });
});
