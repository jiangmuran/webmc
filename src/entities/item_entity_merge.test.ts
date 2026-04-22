import { describe, it, expect } from 'vitest';
import { compactDroppedItems, mergeInto, type DroppedItem } from './item_entity_merge';

const LIMITS = { maxStackSize: () => 64 };

function mkItem(id: number, itemId: string, count: number, x = 0): DroppedItem {
  return {
    id,
    itemId,
    count,
    damage: 0,
    position: { x, y: 0, z: 0 },
    velocity: { x: 0, y: 0, z: 0 },
    ageSec: 0,
  };
}

describe('item merge', () => {
  it('same id merges within range', () => {
    const a = mkItem(1, 'webmc:stone', 5);
    const b = mkItem(2, 'webmc:stone', 3);
    const parent = mergeInto(b, [a], LIMITS);
    expect(parent.id).toBe(1);
    expect(a.count).toBe(8);
  });

  it('different ids do not merge', () => {
    const a = mkItem(1, 'webmc:stone', 5);
    const b = mkItem(2, 'webmc:dirt', 5);
    const parent = mergeInto(b, [a], LIMITS);
    expect(parent.id).toBe(2);
  });

  it('far-apart stacks do not merge', () => {
    const a = mkItem(1, 'webmc:stone', 5, 0);
    const b = mkItem(2, 'webmc:stone', 5, 10);
    const parent = mergeInto(b, [a], LIMITS);
    expect(parent.id).toBe(2);
  });

  it('respects max stack size', () => {
    const a = mkItem(1, 'webmc:stone', 60);
    const b = mkItem(2, 'webmc:stone', 10);
    mergeInto(b, [a], LIMITS);
    expect(a.count).toBe(64);
    expect(b.count).toBe(6);
  });

  it('compact merges in one pass', () => {
    const items = [
      mkItem(1, 'webmc:stone', 10),
      mkItem(2, 'webmc:stone', 20),
      mkItem(3, 'webmc:stone', 30),
    ];
    const compact = compactDroppedItems(items, LIMITS);
    expect(compact.length).toBe(1);
    expect(compact[0]?.count).toBe(60);
  });

  it('compact splits across stack limit', () => {
    const items = [mkItem(1, 'webmc:stone', 60), mkItem(2, 'webmc:stone', 60)];
    const compact = compactDroppedItems(items, LIMITS);
    expect(compact.length).toBe(2);
    expect(compact[0]?.count).toBe(64);
    expect(compact[1]?.count).toBe(56);
  });
});
