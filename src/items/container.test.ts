import { describe, it, expect } from 'vitest';
import { deposit, fillFraction, isEmpty, makeContainer, withdraw } from './container';

const maxStack = (): number => 64;

describe('container', () => {
  it('deposits into empty container', () => {
    const c = makeContainer(27, maxStack);
    const rest = deposit(c, { itemId: 5, count: 3, damage: 0 });
    expect(rest).toBeNull();
    expect(c.slots[0]?.count).toBe(3);
  });

  it('merges into matching slot', () => {
    const c = makeContainer(27, maxStack);
    deposit(c, { itemId: 5, count: 3, damage: 0 });
    const rest = deposit(c, { itemId: 5, count: 7, damage: 0 });
    expect(rest).toBeNull();
    expect(c.slots[0]?.count).toBe(10);
  });

  it('overflows into a new slot when stack is capped', () => {
    const c = makeContainer(27, maxStack);
    c.slots[0] = { itemId: 5, count: 60, damage: 0 };
    const rest = deposit(c, { itemId: 5, count: 10, damage: 0 });
    expect(rest).toBeNull();
    expect(c.slots[0].count).toBe(64);
    expect(c.slots[1]?.count).toBe(6);
  });

  it('returns leftover when fully full', () => {
    const c = makeContainer(2, maxStack);
    c.slots[0] = { itemId: 5, count: 64, damage: 0 };
    c.slots[1] = { itemId: 5, count: 64, damage: 0 };
    const rest = deposit(c, { itemId: 5, count: 10, damage: 0 });
    expect(rest?.count).toBe(10);
  });

  it('withdraw returns taken count', () => {
    const c = makeContainer(27, maxStack);
    deposit(c, { itemId: 5, count: 30, damage: 0 });
    const out = withdraw(c, 5, 0, 20);
    expect(out?.count).toBe(20);
    expect(c.slots[0]?.count).toBe(10);
  });

  it('withdraw returns null when no matching items', () => {
    const c = makeContainer(27, maxStack);
    deposit(c, { itemId: 5, count: 10, damage: 0 });
    const out = withdraw(c, 99, 0, 5);
    expect(out).toBeNull();
  });

  it('isEmpty reflects state', () => {
    const c = makeContainer(27, maxStack);
    expect(isEmpty(c)).toBe(true);
    deposit(c, { itemId: 5, count: 1, damage: 0 });
    expect(isEmpty(c)).toBe(false);
  });

  it('fillFraction scales with usage', () => {
    const c = makeContainer(2, maxStack);
    expect(fillFraction(c)).toBe(0);
    deposit(c, { itemId: 5, count: 64, damage: 0 });
    expect(fillFraction(c)).toBeCloseTo(0.5, 2);
    deposit(c, { itemId: 5, count: 64, damage: 0 });
    expect(fillFraction(c)).toBe(1);
  });
});
