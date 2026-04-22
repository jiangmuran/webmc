import { describe, it, expect } from 'vitest';
import { deliver, handItemToAllay, makeAllay, tryDuplicate, tryPickup } from './allay';

describe('allay', () => {
  it('accepts a held item + owner', () => {
    const a = makeAllay();
    expect(handItemToAllay(a, { itemId: 1, count: 1, damage: 0, name: 'webmc:apple' }, 42)).toBe(
      true,
    );
    expect(a.ownerId).toBe(42);
    expect(a.heldItemName).toBe('webmc:apple');
  });

  it('refuses a second hand-off', () => {
    const a = makeAllay();
    handItemToAllay(a, { itemId: 1, count: 1, damage: 0, name: 'webmc:apple' }, 42);
    expect(handItemToAllay(a, { itemId: 2, count: 1, damage: 0, name: 'webmc:stick' }, 42)).toBe(
      false,
    );
  });

  it('picks up matching items + delivers', () => {
    const a = makeAllay();
    handItemToAllay(a, { itemId: 1, count: 1, damage: 0, name: 'webmc:apple' }, 42);
    expect(
      tryPickup(a, {
        name: 'webmc:apple',
        stack: { itemId: 1, count: 3, damage: 0 },
      }),
    ).toBe(true);
    const d = deliver(a);
    expect(d.delivered?.count).toBe(3);
  });

  it('refuses non-matching pickup', () => {
    const a = makeAllay();
    handItemToAllay(a, { itemId: 1, count: 1, damage: 0, name: 'webmc:apple' }, 42);
    expect(
      tryPickup(a, {
        name: 'webmc:stick',
        stack: { itemId: 2, count: 1, damage: 0 },
      }),
    ).toBe(false);
  });

  it('dance duplicates allay on cooldown', () => {
    const a = makeAllay();
    expect(tryDuplicate(a, 0).canDuplicate).toBe(true);
    expect(tryDuplicate(a, 100).canDuplicate).toBe(false);
    expect(tryDuplicate(a, 1000).canDuplicate).toBe(true);
  });
});
