import { describe, it, expect } from 'vitest';
import {
  facingDelta,
  HOPPER_TRANSFER_INTERVAL,
  makeHopper,
  tickHopper,
  type InventoryLike,
} from './hopper_transfer';

function emptyInv(size = 5): InventoryLike {
  return { slots: Array.from({ length: size }, () => null), maxStack: () => 64 };
}

describe('hopper transfer', () => {
  it('facing down delta is (0,-1,0)', () => {
    expect(facingDelta('down')).toEqual({ x: 0, y: -1, z: 0 });
  });

  it('pulls one item every 8 ticks', () => {
    const h = makeHopper();
    const above = emptyInv();
    above.slots[0] = { item: 'webmc:dirt', count: 64, damage: 0 };
    const facing = emptyInv();
    for (let i = 0; i < HOPPER_TRANSFER_INTERVAL - 1; i++) {
      tickHopper(h, { inventoryAbove: above, inventoryFacing: facing });
    }
    const r = tickHopper(h, { inventoryAbove: above, inventoryFacing: facing });
    expect(r.pulled?.item).toBe('webmc:dirt');
  });

  it('locked hopper does nothing', () => {
    const h = makeHopper();
    h.locked = true;
    const r = tickHopper(h, { inventoryAbove: null, inventoryFacing: null });
    expect(r.pulled).toBeNull();
  });

  it('pushes into facing inventory', () => {
    const h = makeHopper();
    h.inventory.slots[0] = { item: 'webmc:stone', count: 10, damage: 0 };
    const facing = emptyInv();
    for (let i = 0; i < HOPPER_TRANSFER_INTERVAL; i++) {
      tickHopper(h, { inventoryAbove: null, inventoryFacing: facing });
    }
    expect(facing.slots.some((s) => s?.item === 'webmc:stone')).toBe(true);
  });
});
