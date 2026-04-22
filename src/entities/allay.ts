// Allay. Follows the player who gave it a stack; picks up matching items
// off the ground, delivers them back. Duplicates when dancing near a
// jukebox with an amethyst shard.

import type { ItemStack } from '@/items/item';

export interface AllayState {
  ownerId: number | null;
  heldItemName: string | null;
  targetMatchStackName: string | null;
  carryingStack: ItemStack | null;
  danceCooldownSec: number;
}

export function makeAllay(): AllayState {
  return {
    ownerId: null,
    heldItemName: null,
    targetMatchStackName: null,
    carryingStack: null,
    danceCooldownSec: 0,
  };
}

// Handing an item to the allay: records the owner + the target stack
// pattern to collect.
export function handItemToAllay(
  state: AllayState,
  itemStack: ItemStack & { name: string },
  ownerId: number,
): boolean {
  if (state.heldItemName) return false;
  state.ownerId = ownerId;
  state.heldItemName = itemStack.name;
  state.targetMatchStackName = itemStack.name;
  return true;
}

// Spotting a matching ground item — allay picks it up.
export function tryPickup(state: AllayState, item: { name: string; stack: ItemStack }): boolean {
  if (state.heldItemName === null || state.targetMatchStackName === null) return false;
  if (item.name !== state.targetMatchStackName) return false;
  if (state.carryingStack) return false;
  state.carryingStack = { ...item.stack };
  return true;
}

// Delivery: drop the carried stack near the owner.
export interface DeliverResult {
  delivered: ItemStack | null;
}

export function deliver(state: AllayState): DeliverResult {
  const out = state.carryingStack;
  state.carryingStack = null;
  return { delivered: out };
}

// Dancing near a jukebox — feeding an amethyst shard duplicates the allay
// (only once per amethyst).
const DANCE_COOLDOWN_SEC = 300;

export interface DuplicateResult {
  canDuplicate: boolean;
}

export function tryDuplicate(state: AllayState, nowSec: number): DuplicateResult {
  if (state.danceCooldownSec > nowSec) return { canDuplicate: false };
  state.danceCooldownSec = nowSec + DANCE_COOLDOWN_SEC;
  return { canDuplicate: true };
}
