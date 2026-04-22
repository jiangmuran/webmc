// Chest boat — a boat with a 27-slot chest. Drops its contents when
// destroyed (unless in creative). Shares the boat physics from `boat.ts`.

import type { ItemStack } from '@/items/item';
import { makeContainer, type Container } from '@/items/container';
import type { Boat, BoatInput, BoatLookup } from './boat';
import { tickBoat } from './boat';

export interface ChestBoat {
  boat: Boat;
  inventory: Container;
  woodKind:
    | 'oak'
    | 'spruce'
    | 'birch'
    | 'jungle'
    | 'acacia'
    | 'dark_oak'
    | 'mangrove'
    | 'cherry'
    | 'bamboo';
}

export function makeChestBoat(
  boat: Boat,
  woodKind: ChestBoat['woodKind'] = 'oak',
  maxStack: (itemId: number) => number = () => 64,
): ChestBoat {
  return {
    boat,
    inventory: makeContainer(27, maxStack),
    woodKind,
  };
}

export function tickChestBoat(
  state: ChestBoat,
  dtSec: number,
  input: BoatInput,
  lookup: BoatLookup,
): void {
  tickBoat(state.boat, dtSec, input, lookup);
}

export function destroyChestBoat(state: ChestBoat): readonly ItemStack[] {
  const drops: ItemStack[] = [];
  for (const s of state.inventory.slots) if (s) drops.push(s);
  state.inventory.slots = state.inventory.slots.map(() => null);
  return drops;
}
