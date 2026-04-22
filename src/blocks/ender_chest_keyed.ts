// Ender chest inventory is per-player, not per-block. Any ender chest
// anywhere opens the same 27-slot inventory for that player.

export interface PlayerEnderInventory {
  playerId: string;
  slots: (string | null)[];
}

export const ENDER_CHEST_SIZE = 27;

export function newInventory(playerId: string): PlayerEnderInventory {
  return { playerId, slots: Array(ENDER_CHEST_SIZE).fill(null) as (string | null)[] };
}

export function setSlot(inv: PlayerEnderInventory, idx: number, item: string | null): boolean {
  if (idx < 0 || idx >= ENDER_CHEST_SIZE) return false;
  inv.slots[idx] = item;
  return true;
}

export function countEmpty(inv: PlayerEnderInventory): number {
  return inv.slots.filter((s) => s === null).length;
}

// Breaking the block requires silk touch to recover; otherwise drops 8 obsidian.
export function drops(silkTouch: boolean): string[] {
  if (silkTouch) return ['ender_chest'];
  return [
    'obsidian',
    'obsidian',
    'obsidian',
    'obsidian',
    'obsidian',
    'obsidian',
    'obsidian',
    'obsidian',
  ];
}
