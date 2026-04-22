// Allay + note block pairing. An allay given an item while near a
// note block binds the noteblock as its "home": delivers items there
// instead of to the player.

export interface AllayHome {
  homePos: { x: number; y: number; z: number } | null;
  heldItemId: string | null;
  ownerPlayerId: string | null;
}

export function bind(a: AllayHome, pos: { x: number; y: number; z: number }): boolean {
  if (!a.heldItemId) return false;
  a.homePos = pos;
  return true;
}

export function unbind(a: AllayHome): boolean {
  if (!a.homePos) return false;
  a.homePos = null;
  return true;
}

export type Destination =
  | { kind: 'noteblock'; pos: { x: number; y: number; z: number } }
  | { kind: 'owner' }
  | { kind: 'none' };

export function deliveryTarget(a: AllayHome): Destination {
  if (a.homePos) return { kind: 'noteblock', pos: a.homePos };
  if (a.ownerPlayerId) return { kind: 'owner' };
  return { kind: 'none' };
}

// Noteblock played by allay triggers dance; unrelated pairing.
export function noteblockPlayedInRange(distance: number): boolean {
  return distance <= 16;
}
