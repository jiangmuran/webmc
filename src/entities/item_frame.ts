// Item frame — a decorative block-entity that holds a single item. Glow
// item frames make the held item emit light.

import type { ItemStack } from '@/items/item';

export type FrameFacing = 'north' | 'south' | 'east' | 'west' | 'up' | 'down';

export interface ItemFrameState {
  item: ItemStack | null;
  rotation: number; // 0..7
  facing: FrameFacing;
  glow: boolean;
}

export function makeItemFrame(facing: FrameFacing, glow = false): ItemFrameState {
  return { item: null, rotation: 0, facing, glow };
}

export function placeItem(state: ItemFrameState, stack: ItemStack): ItemStack | null {
  if (state.item) return stack;
  state.item = { ...stack, count: 1 };
  const leftover = stack.count - 1;
  return leftover > 0 ? { ...stack, count: leftover } : null;
}

export function rotateItem(state: ItemFrameState): boolean {
  if (!state.item) return false;
  state.rotation = (state.rotation + 1) % 8;
  return true;
}

export function takeItem(state: ItemFrameState): ItemStack | null {
  const i = state.item;
  state.item = null;
  state.rotation = 0;
  return i;
}

export function comparatorSignal(state: ItemFrameState): number {
  if (!state.item) return 0;
  return state.rotation + 1;
}
