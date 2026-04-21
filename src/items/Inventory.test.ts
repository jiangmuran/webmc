import { describe, it, expect } from 'vitest';
import { HOTBAR_SIZE, Inventory, MAIN_SIZE } from './Inventory';
import { ItemRegistry, stack } from './item';

function registry(): ItemRegistry {
  const r = new ItemRegistry();
  r.register({ name: 'webmc:stone', maxStack: 64, durability: 0 });
  r.register({ name: 'webmc:wood', maxStack: 64, durability: 0 });
  r.register({ name: 'webmc:pickaxe', maxStack: 1, durability: 132 });
  return r;
}

describe('Inventory', () => {
  it('starts empty, 9+27+4 slots', () => {
    const inv = new Inventory(registry());
    expect(inv.hotbar.every((s) => s === null)).toBe(true);
    expect(inv.main.every((s) => s === null)).toBe(true);
    expect(inv.armor.every((s) => s === null)).toBe(true);
    expect(inv.offhand).toBeNull();
    expect(inv.isFull).toBe(false);
  });

  it('add fills the first hotbar slot when inventory is empty', () => {
    const inv = new Inventory(registry());
    const leftover = inv.add(stack(1, 5, 0));
    expect(leftover).toBe(0);
    expect(inv.hotbar[0]).toEqual(stack(1, 5, 0));
  });

  it('add merges into an existing stack of the same item', () => {
    const r = registry();
    const inv = new Inventory(r);
    inv.add(stack(1, 10));
    inv.add(stack(1, 20));
    expect(inv.hotbar[0]?.count).toBe(30);
  });

  it('add spills across slots when max-stack is exceeded', () => {
    const r = registry();
    const inv = new Inventory(r);
    inv.add(stack(1, 80));
    expect(inv.hotbar[0]?.count).toBe(64);
    expect(inv.hotbar[1]?.count).toBe(16);
  });

  it('add returns leftover when inventory is full', () => {
    const r = registry();
    const inv = new Inventory(r);
    const total = (HOTBAR_SIZE + MAIN_SIZE) * 64;
    const leftover = inv.add(stack(1, total + 5));
    expect(leftover).toBe(5);
    expect(inv.isFull).toBe(true);
  });

  it('remove drains the hotbar before the main area', () => {
    const r = registry();
    const inv = new Inventory(r);
    inv.add(stack(1, 100));
    const removed = inv.remove(1, 50);
    expect(removed).toBe(50);
    expect(inv.count(1)).toBe(50);
  });

  it('remove caps at available and returns the actual count', () => {
    const r = registry();
    const inv = new Inventory(r);
    inv.add(stack(1, 3));
    const removed = inv.remove(1, 99);
    expect(removed).toBe(3);
    expect(inv.count(1)).toBe(0);
  });

  it('selectSlot clamps to [0, 8]', () => {
    const inv = new Inventory(registry());
    inv.selectSlot(-1);
    expect(inv.selectedHotbar).toBe(0);
    inv.selectSlot(99);
    expect(inv.selectedHotbar).toBe(0);
    inv.selectSlot(5);
    expect(inv.selectedHotbar).toBe(5);
  });

  it('non-stackable items (maxStack=1) go to separate slots', () => {
    const inv = new Inventory(registry());
    inv.add(stack(3, 1));
    inv.add(stack(3, 1));
    expect(inv.hotbar[0]?.count).toBe(1);
    expect(inv.hotbar[1]?.count).toBe(1);
  });
});
