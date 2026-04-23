import { describe, it, expect } from 'vitest';
import { merge } from './shift_click_transfer';

describe('shift click transfer', () => {
  it('fills empty slot', () => {
    const dest = [{ id: null, count: 0, maxStack: 64 }];
    const r = merge({ id: 'stone', count: 32, maxStack: 64 }, dest);
    expect(r.fromRemaining).toBe(0);
    expect(dest[0]?.id).toBe('stone');
    expect(dest[0]?.count).toBe(32);
  });

  it('stacks onto matching first', () => {
    const dest = [
      { id: 'stone', count: 30, maxStack: 64 },
      { id: null, count: 0, maxStack: 64 },
    ];
    const r = merge({ id: 'stone', count: 20, maxStack: 64 }, dest);
    expect(r.movedCount).toBe(20);
    expect(dest[0]?.count).toBe(50);
  });

  it('spills to empty', () => {
    const dest = [
      { id: 'stone', count: 64, maxStack: 64 },
      { id: null, count: 0, maxStack: 64 },
    ];
    const r = merge({ id: 'stone', count: 10, maxStack: 64 }, dest);
    expect(dest[1]?.count).toBe(10);
    expect(r.fromRemaining).toBe(0);
  });

  it('no space returns remainder', () => {
    const dest = [{ id: 'dirt', count: 64, maxStack: 64 }];
    const r = merge({ id: 'stone', count: 5, maxStack: 64 }, dest);
    expect(r.fromRemaining).toBe(5);
  });
});
