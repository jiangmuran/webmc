// Dispenser / dropper. Both have a 3×3 inventory and fire on a redstone
// edge. Dispenser uses item-specific effects (bucket of water → place water,
// bow → shoot arrow); dropper just tosses the item into the world as an
// ItemEntity.
//
// This module is the pure "pick a slot to fire" + "what action to take"
// calculator; the caller wires it to ItemEntityWorld / FluidWorld /
// ProjectileWorld depending on the item.

import type { ItemStack } from '@/items/item';

export type DispenserAction =
  | { kind: 'drop'; slot: number; stack: ItemStack }
  | { kind: 'place_fluid'; slot: number; fluid: 'water' | 'lava' }
  | { kind: 'shoot_arrow'; slot: number }
  | { kind: 'ignite_tnt'; slot: number }
  | { kind: 'place_block'; slot: number; stack: ItemStack }
  | { kind: 'none' };

export interface DispenserQuery {
  slots: readonly (ItemStack | null)[]; // length 9
  rng: () => number;
  itemName(itemId: number): string;
  isDispenser: boolean; // true = dispenser, false = dropper
}

// Picks a non-empty slot uniformly at random.
function pickNonEmptySlot(slots: readonly (ItemStack | null)[], rng: () => number): number {
  const indices: number[] = [];
  for (let i = 0; i < slots.length; i++) {
    if (slots[i] !== null) indices.push(i);
  }
  if (indices.length === 0) return -1;
  const idx = indices[Math.floor(rng() * indices.length)];
  return idx ?? -1;
}

export function nextAction(q: DispenserQuery): DispenserAction {
  const idx = pickNonEmptySlot(q.slots, q.rng);
  if (idx < 0) return { kind: 'none' };
  const stack = q.slots[idx];
  if (!stack) return { kind: 'none' };
  if (!q.isDispenser) {
    return { kind: 'drop', slot: idx, stack };
  }
  const name = q.itemName(stack.itemId);
  if (name === 'webmc:water_bucket') return { kind: 'place_fluid', slot: idx, fluid: 'water' };
  if (name === 'webmc:lava_bucket') return { kind: 'place_fluid', slot: idx, fluid: 'lava' };
  if (name === 'webmc:arrow') return { kind: 'shoot_arrow', slot: idx };
  if (name === 'webmc:tnt') return { kind: 'ignite_tnt', slot: idx };
  // Dispensers place blocks for some items (pumpkin head, shulker-box,
  // anvil via falling-block). Keep it generic: if the item has a blockId
  // the caller can map, dispense as a block placement.
  return { kind: 'place_block', slot: idx, stack };
}
