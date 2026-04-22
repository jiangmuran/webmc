import { describe, it, expect } from 'vitest';
import { sortInventory, type InvItem } from './inventory_sort_assist';

const TOOL: InvItem = { id: 'webmc:iron_pickaxe', count: 1, category: 'tools', stackMax: 1 };
const STONE = (count: number): InvItem => ({
  id: 'webmc:stone',
  count,
  category: 'building_blocks',
  stackMax: 64,
});
const APPLE: InvItem = { id: 'webmc:apple', count: 3, category: 'food', stackMax: 64 };

describe('inventory sort', () => {
  it('weapons/tools/food before blocks', () => {
    const sorted = sortInventory([STONE(10), TOOL, APPLE, null]);
    expect(sorted[0]?.category).toBe('tools');
    expect(sorted[1]?.category).toBe('food');
    expect(sorted[2]?.category).toBe('building_blocks');
  });

  it('coalesces stackable', () => {
    const sorted = sortInventory([STONE(10), STONE(10), STONE(30), null]);
    expect(sorted.filter((x) => x !== null).length).toBe(1);
    expect(sorted[0]?.count).toBe(50);
  });

  it('overflows into second stack', () => {
    const sorted = sortInventory([STONE(40), STONE(40), null, null]);
    expect(sorted[0]?.count).toBe(64);
    expect(sorted[1]?.count).toBe(16);
  });

  it('preserves length', () => {
    const sorted = sortInventory([null, null, STONE(1)]);
    expect(sorted.length).toBe(3);
  });
});
