// Barrel block. 27-slot container, functionally identical to a chest
// but with no opening-clearance requirement (can have a block placed
// directly above). "Open" state tracks whether any player has the GUI
// up; used for the barrel lid animation + light changes.

import type { ItemSlot } from './hopper_transfer';

export const BARREL_SLOTS = 27;

export interface BarrelState {
  slots: (ItemSlot | null)[];
  openViewers: Set<string>;
  facing: 'up' | 'down' | 'north' | 'south' | 'east' | 'west';
}

export function makeBarrel(facing: BarrelState['facing'] = 'up'): BarrelState {
  return {
    slots: Array.from({ length: BARREL_SLOTS }, () => null),
    openViewers: new Set(),
    facing,
  };
}

export function openBarrel(state: BarrelState, playerId: string): boolean {
  if (state.openViewers.has(playerId)) return false;
  state.openViewers.add(playerId);
  return true;
}

export function closeBarrel(state: BarrelState, playerId: string): boolean {
  return state.openViewers.delete(playerId);
}

export function isOpen(state: BarrelState): boolean {
  return state.openViewers.size > 0;
}

// Unlike chests, barrels can be placed on any face, and the "lid"
// faces away from the attached side.
export function lidFacing(state: BarrelState): BarrelState['facing'] {
  return state.facing;
}

// Break drops: if any slot has items, drop them with the barrel item.
export function breakBarrel(state: BarrelState): { item: string; count: number }[] {
  const drops: { item: string; count: number }[] = [{ item: 'webmc:barrel', count: 1 }];
  for (const s of state.slots) {
    if (s && s.count > 0) drops.push({ item: s.item, count: s.count });
  }
  return drops;
}

// Hopper compatibility: barrel inventories are accepted by the hopper
// interface (InventoryLike) — return an adapter.
export interface InventoryLike {
  slots: (ItemSlot | null)[];
  maxStack: (item: string) => number;
}

export function asInventoryLike(state: BarrelState): InventoryLike {
  return { slots: state.slots, maxStack: () => 64 };
}
