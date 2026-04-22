// Shulker box. 27-slot container that remembers contents when picked up
// (rare trait — most containers drop their contents). 16 dyed color
// variants + plain undyed.

import type { ItemStack } from '@/items/item';
import { deposit, makeContainer, withdraw, type Container } from '@/items/container';

export type ShulkerColor =
  | 'plain'
  | 'white'
  | 'orange'
  | 'magenta'
  | 'light_blue'
  | 'yellow'
  | 'lime'
  | 'pink'
  | 'gray'
  | 'light_gray'
  | 'cyan'
  | 'purple'
  | 'blue'
  | 'brown'
  | 'green'
  | 'red'
  | 'black';

export interface ShulkerBoxState {
  color: ShulkerColor;
  inventory: Container;
}

export function makeShulkerBox(
  color: ShulkerColor = 'plain',
  maxStack: (itemId: number) => number = () => 64,
): ShulkerBoxState {
  return { color, inventory: makeContainer(27, maxStack) };
}

export function depositToBox(state: ShulkerBoxState, stack: ItemStack): ItemStack | null {
  return deposit(state.inventory, stack);
}

export function takeFromBox(
  state: ShulkerBoxState,
  itemId: number,
  damage: number,
  count: number,
): ItemStack | null {
  return withdraw(state.inventory, itemId, damage, count);
}

// Shulker boxes can't go inside other shulker boxes (MC prevents nesting).
export function isNestingAttempt(
  stack: ItemStack,
  isShulkerItem: (id: number) => boolean,
): boolean {
  return isShulkerItem(stack.itemId);
}

export function dyeBox(state: ShulkerBoxState, color: ShulkerColor): void {
  state.color = color;
}
