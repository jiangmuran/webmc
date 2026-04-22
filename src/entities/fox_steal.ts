// Fox item-steal. A fox without a held item may pick up a nearby dropped
// stack; right-click trust + sleep prevents it.

import type { ItemStack } from '@/items/item';

export interface FoxState {
  heldStack: ItemStack | null;
  trustedPlayerIds: Set<number>;
  sleeping: boolean;
}

export function makeFox(): FoxState {
  return { heldStack: null, trustedPlayerIds: new Set(), sleeping: false };
}

// A fox picks up a dropped item if it has none, isn't sleeping, and the
// item type is food or a tool (simplified to "small stacks").
export interface StealCtx {
  item: ItemStack;
  itemName: string;
}

export interface StealResult {
  stolen: boolean;
}

const STEALABLE_CLASS = new Set([
  'webmc:sweet_berries',
  'webmc:glow_berries',
  'webmc:apple',
  'webmc:bread',
  'webmc:cookie',
  'webmc:rabbit_foot',
  'webmc:emerald',
  'webmc:diamond',
]);

export function tryFoxSteal(state: FoxState, ctx: StealCtx): StealResult {
  if (state.sleeping) return { stolen: false };
  if (state.heldStack) return { stolen: false };
  if (!STEALABLE_CLASS.has(ctx.itemName)) return { stolen: false };
  state.heldStack = { ...ctx.item };
  return { stolen: true };
}

// Taming / trust happens when two foxes breed with one sweet-berry
// stack + a player + light levels matching.
export function trustPlayer(state: FoxState, playerId: number): void {
  state.trustedPlayerIds.add(playerId);
}

export function foxIsTrusted(state: FoxState, playerId: number): boolean {
  return state.trustedPlayerIds.has(playerId);
}

export function setSleeping(state: FoxState, sleeping: boolean): void {
  state.sleeping = sleeping;
}
