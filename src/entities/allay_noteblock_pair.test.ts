import { describe, it, expect } from 'vitest';
import { bind, unbind, deliveryTarget, noteblockPlayedInRange } from './allay_noteblock_pair';

describe('allay noteblock pair', () => {
  it('requires held item to bind', () => {
    const a = { homePos: null, heldItemId: null, ownerPlayerId: 'p' };
    expect(bind(a, { x: 1, y: 2, z: 3 })).toBe(false);
  });

  it('binds with item', () => {
    const a = { homePos: null, heldItemId: 'webmc:stone', ownerPlayerId: 'p' };
    expect(bind(a, { x: 1, y: 2, z: 3 })).toBe(true);
  });

  it('unbind', () => {
    const a = { homePos: { x: 0, y: 0, z: 0 }, heldItemId: 'x', ownerPlayerId: 'p' };
    expect(unbind(a)).toBe(true);
    expect(a.homePos).toBeNull();
  });

  it('delivery priority', () => {
    const owned = { homePos: null, heldItemId: 'x', ownerPlayerId: 'p' };
    expect(deliveryTarget(owned).kind).toBe('owner');
    const bound = { homePos: { x: 1, y: 2, z: 3 }, heldItemId: 'x', ownerPlayerId: 'p' };
    expect(deliveryTarget(bound).kind).toBe('noteblock');
  });

  it('range check', () => {
    expect(noteblockPlayedInRange(16)).toBe(true);
    expect(noteblockPlayedInRange(17)).toBe(false);
  });
});
