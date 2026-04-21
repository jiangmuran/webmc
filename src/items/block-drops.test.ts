import { describe, it, expect } from 'vitest';
import { BlockDropRegistry } from './block-drops';

describe('BlockDropRegistry', () => {
  it('unregistered blocks drop nothing', () => {
    const r = new BlockDropRegistry();
    expect(r.drops(42, undefined, 0)).toEqual([]);
  });

  it('fixed-count rule: min == max always yields that count', () => {
    const r = new BlockDropRegistry();
    r.register(1, [{ itemId: 10, min: 2, max: 2 }]);
    expect(r.drops(1, undefined, 0)).toEqual([{ itemId: 10, count: 2, damage: 0 }]);
  });

  it('requiresToolKind filters by tool category', () => {
    const r = new BlockDropRegistry();
    r.register(1, [{ itemId: 10, min: 1, max: 1, requiresToolKind: 'pickaxe' }]);
    expect(r.drops(1, undefined, 0)).toEqual([]);
    expect(r.drops(1, 'axe', 0)).toEqual([]);
    expect(r.drops(1, 'pickaxe', 0)).toEqual([{ itemId: 10, count: 1, damage: 0 }]);
  });

  it('requiresToolTier gates by level', () => {
    const r = new BlockDropRegistry();
    r.register(1, [
      { itemId: 10, min: 1, max: 1, requiresToolKind: 'pickaxe', requiresToolTier: 2 },
    ]);
    expect(r.drops(1, 'pickaxe', 1)).toEqual([]);
    expect(r.drops(1, 'pickaxe', 2)).toEqual([{ itemId: 10, count: 1, damage: 0 }]);
  });

  it('range rule samples via injected rng', () => {
    const r = new BlockDropRegistry();
    r.register(1, [{ itemId: 10, min: 1, max: 5 }]);
    const stacks = r.drops(1, undefined, 0, () => 0.99);
    expect(stacks).toHaveLength(1);
    expect(stacks[0]?.count).toBe(5);
  });

  it('multiple rules all fire when conditions match', () => {
    const r = new BlockDropRegistry();
    r.register(1, [
      { itemId: 10, min: 1, max: 1 },
      { itemId: 11, min: 2, max: 2 },
    ]);
    expect(r.drops(1, undefined, 0)).toHaveLength(2);
  });
});
