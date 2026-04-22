// Allay. Given an item, follows the player and picks up matching
// items, dropping them at a "home" noteblock or at the player.

export interface Allay {
  heldItem: string | null;
  homeNoteblockPos: { x: number; y: number; z: number } | null;
  ownerPlayerId: string | null;
}

export function makeAllay(): Allay {
  return { heldItem: null, homeNoteblockPos: null, ownerPlayerId: null };
}

export function giveItem(a: Allay, playerId: string, itemId: string): boolean {
  if (a.heldItem !== null) return false;
  a.heldItem = itemId;
  a.ownerPlayerId = playerId;
  return true;
}

export function takeItem(a: Allay): string | null {
  const i = a.heldItem;
  a.heldItem = null;
  a.ownerPlayerId = null;
  a.homeNoteblockPos = null;
  return i;
}

export function bindToNoteblock(a: Allay, pos: { x: number; y: number; z: number }): boolean {
  if (a.heldItem === null) return false;
  a.homeNoteblockPos = pos;
  return true;
}

export interface PickupQuery {
  groundItemId: string;
}

export function shouldPickup(a: Allay, q: PickupQuery): boolean {
  if (a.heldItem === null) return false;
  return q.groundItemId === a.heldItem;
}

export function dropTarget(a: Allay): { x: number; y: number; z: number } | 'owner' | null {
  if (a.homeNoteblockPos) return a.homeNoteblockPos;
  if (a.ownerPlayerId) return 'owner';
  return null;
}
