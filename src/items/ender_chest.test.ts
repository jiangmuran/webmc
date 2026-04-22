import { describe, it, expect } from 'vitest';
import { EnderChestStore } from './ender_chest';
import { deposit } from './container';

describe('EnderChestStore', () => {
  it('creates a 27-slot chest on first access', () => {
    const store = new EnderChestStore(() => 64);
    const c = store.getFor('alice');
    expect(c.size).toBe(27);
  });

  it('same player gets the same chest across calls (cross-dimension persistence)', () => {
    const store = new EnderChestStore(() => 64);
    const a1 = store.getFor('alice');
    deposit(a1, { itemId: 5, count: 10, damage: 0 });
    const a2 = store.getFor('alice');
    expect(a2.slots[0]?.count).toBe(10);
  });

  it('different players have isolated chests', () => {
    const store = new EnderChestStore(() => 64);
    const a = store.getFor('alice');
    const b = store.getFor('bob');
    deposit(a, { itemId: 5, count: 10, damage: 0 });
    expect(b.slots.every((s) => s === null)).toBe(true);
  });

  it('hasFor + removeFor work', () => {
    const store = new EnderChestStore(() => 64);
    expect(store.hasFor('alice')).toBe(false);
    store.getFor('alice');
    expect(store.hasFor('alice')).toBe(true);
    store.removeFor('alice');
    expect(store.hasFor('alice')).toBe(false);
  });
});
