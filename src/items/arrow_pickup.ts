// Arrow pickup rules. Regular arrows picked up by survival-mode players
// go to inventory. Arrows fired from an Infinity bow do NOT drop (no
// pickup). Creative-fired arrows are invisible to pickup. Tipped and
// spectral arrows restore the original item.

export type ArrowItem = 'arrow' | 'spectral_arrow' | 'tipped_arrow';

export interface ArrowStack {
  kind: ArrowItem;
  tipId?: string; // for tipped arrows
}

export interface ArrowPickupQuery {
  firedBy: 'survival_player' | 'creative_player' | 'mob' | 'dispenser';
  hadInfinityOnBow: boolean;
  arrow: ArrowStack;
}

export type PickupOutcome = 'no_pickup' | 'add_to_inventory' | 'add_original_item';

export function arrowPickupBehavior(q: ArrowPickupQuery): PickupOutcome {
  if (q.firedBy === 'creative_player') return 'no_pickup';
  if (q.hadInfinityOnBow && q.arrow.kind === 'arrow') return 'no_pickup';
  if (q.arrow.kind === 'tipped_arrow' || q.arrow.kind === 'spectral_arrow') {
    return 'add_original_item';
  }
  return 'add_to_inventory';
}

// Pickup radius: arrows are collected when a player's AABB intersects
// theirs, typically 1 block.
export const ARROW_PICKUP_RADIUS = 1.2;

export function playerCanPickupArrow(
  arrowPos: { x: number; y: number; z: number },
  playerPos: { x: number; y: number; z: number },
): boolean {
  const dx = arrowPos.x - playerPos.x;
  const dy = arrowPos.y - playerPos.y;
  const dz = arrowPos.z - playerPos.z;
  return Math.hypot(dx, dy, dz) <= ARROW_PICKUP_RADIUS;
}

// Stuck arrows are shown as decorations on the player model if they
// hit the player. Max 14 visible stuck arrows.
export const MAX_STUCK_ARROWS = 14;

export interface StuckArrowTracker {
  count: number;
}

export function addStuckArrow(tracker: StuckArrowTracker): boolean {
  if (tracker.count >= MAX_STUCK_ARROWS) return false;
  tracker.count++;
  return true;
}

export function removeStuckArrow(tracker: StuckArrowTracker): void {
  tracker.count = Math.max(0, tracker.count - 1);
}
