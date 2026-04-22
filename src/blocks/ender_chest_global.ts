// Ender chest shares 27 slots across all dimensions per player. The
// block itself is not a container — it just opens the player's
// personal storage. Silk Touch drops the block; otherwise drops 8
// obsidian + 1 eye-of-ender.

export interface EnderStorage {
  byPlayer: Map<string, (Item | null)[]>;
}

export interface Item {
  id: string;
  count: number;
}

export const ENDER_SIZE = 27;

export function makeStorage(): EnderStorage {
  return { byPlayer: new Map() };
}

export function inventoryFor(s: EnderStorage, playerId: string): (Item | null)[] {
  let inv = s.byPlayer.get(playerId);
  if (!inv) {
    inv = Array.from({ length: ENDER_SIZE }, () => null);
    s.byPlayer.set(playerId, inv);
  }
  return inv;
}

export interface BreakQuery {
  withSilkTouch: boolean;
  withFortuneLevel: number;
}

export interface BreakResult {
  drops: { id: string; count: number }[];
}

export function onBroken(q: BreakQuery): BreakResult {
  if (q.withSilkTouch) {
    return { drops: [{ id: 'webmc:ender_chest', count: 1 }] };
  }
  return { drops: [{ id: 'webmc:obsidian', count: 8 }] };
}

// Crafting recipe: 8 obsidian + 1 eye-of-ender.
export function craftEnderChest(obsidian: number, eye: number): boolean {
  return obsidian >= 8 && eye >= 1;
}
