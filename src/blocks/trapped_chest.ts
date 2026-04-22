// Trapped chest. Same inventory as a regular chest, plus emits a redstone
// signal proportional to the number of viewers (1..15).

import type { Container } from '@/items/container';
import { makeContainer } from '@/items/container';

export interface TrappedChestState {
  inventory: Container;
  viewers: Set<string>;
}

export function makeTrappedChest(
  maxStack: (itemId: number) => number = () => 64,
): TrappedChestState {
  return { inventory: makeContainer(27, maxStack), viewers: new Set() };
}

export function openChest(state: TrappedChestState, playerId: string): void {
  state.viewers.add(playerId);
}

export function closeChest(state: TrappedChestState, playerId: string): void {
  state.viewers.delete(playerId);
}

export function signalStrength(state: TrappedChestState): number {
  return Math.min(15, state.viewers.size);
}
