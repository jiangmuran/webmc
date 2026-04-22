// Hopper item transfer. Every 8 ticks (0.4s) a hopper:
//   1. Pulls one item from the container above (or item entities in its
//      collection AABB).
//   2. Pushes one item into the container it faces.
// Locked hoppers (signal) skip their tick. Direction is set at placement.

export type HopperFacing = 'down' | 'north' | 'south' | 'east' | 'west';

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface ItemSlot {
  item: string;
  count: number;
  damage: number;
}

export interface InventoryLike {
  slots: (ItemSlot | null)[];
  maxStack: (item: string) => number;
}

export interface HopperState {
  facing: HopperFacing;
  tickCounter: number; // 0..TRANSFER_INTERVAL
  locked: boolean;
  inventory: InventoryLike; // 5 slots
}

const TRANSFER_INTERVAL = 8; // ticks

export function makeHopper(facing: HopperFacing = 'down'): HopperState {
  return {
    facing,
    tickCounter: 0,
    locked: false,
    inventory: {
      slots: [null, null, null, null, null],
      maxStack: () => 64,
    },
  };
}

export function facingDelta(f: HopperFacing): Vec3 {
  switch (f) {
    case 'down':
      return { x: 0, y: -1, z: 0 };
    case 'north':
      return { x: 0, y: 0, z: -1 };
    case 'south':
      return { x: 0, y: 0, z: 1 };
    case 'east':
      return { x: 1, y: 0, z: 0 };
    case 'west':
      return { x: -1, y: 0, z: 0 };
  }
}

export interface HopperTickCtx {
  inventoryAbove: InventoryLike | null;
  inventoryFacing: InventoryLike | null;
}

export interface HopperTickResult {
  pulled: ItemSlot | null;
  pushed: ItemSlot | null;
}

// Pull 1 item from the first non-empty slot of `source`, add to `dest`.
function moveOne(source: InventoryLike, dest: InventoryLike): ItemSlot | null {
  for (let i = 0; i < source.slots.length; i++) {
    const slot = source.slots[i];
    if (!slot || slot.count <= 0) continue;
    // Find a compatible slot in dest.
    for (let j = 0; j < dest.slots.length; j++) {
      const ds = dest.slots[j];
      if (ds && (ds.item !== slot.item || ds.damage !== slot.damage)) continue;
      const cap = dest.maxStack(slot.item);
      const curCount = ds?.count ?? 0;
      if (curCount >= cap) continue;
      dest.slots[j] = { item: slot.item, count: curCount + 1, damage: slot.damage };
      slot.count--;
      if (slot.count === 0) source.slots[i] = null;
      return { item: slot.item, count: 1, damage: slot.damage };
    }
  }
  return null;
}

export function tickHopper(state: HopperState, ctx: HopperTickCtx): HopperTickResult {
  if (state.locked) return { pulled: null, pushed: null };
  state.tickCounter++;
  if (state.tickCounter < TRANSFER_INTERVAL) return { pulled: null, pushed: null };
  state.tickCounter = 0;
  const pulled = ctx.inventoryAbove ? moveOne(ctx.inventoryAbove, state.inventory) : null;
  const pushed = ctx.inventoryFacing ? moveOne(state.inventory, ctx.inventoryFacing) : null;
  return { pulled, pushed };
}

export const HOPPER_TRANSFER_INTERVAL = TRANSFER_INTERVAL;
