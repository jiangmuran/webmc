// Arrow pickup. When an arrow lands, after a delay it can be picked
// up (if shot by a non-creative player). Infinity bow arrows are not
// pickupable.

export type PickupState = 'denied' | 'allowed' | 'creative_only';

export interface Arrow {
  shooterId: string | null;
  pickupState: PickupState;
  lifetimeTicks: number;
  inGround: boolean;
}

export const DESPAWN_TICKS = 1200; // 60 s

export function makeArrow(shooterId: string | null, infinityBow = false, creative = false): Arrow {
  return {
    shooterId,
    pickupState: infinityBow ? 'denied' : creative ? 'creative_only' : 'allowed',
    lifetimeTicks: 0,
    inGround: false,
  };
}

export interface TickResult {
  despawned: boolean;
}

export function tickArrow(a: Arrow): TickResult {
  a.lifetimeTicks += 1;
  if (!a.inGround) return { despawned: false };
  return { despawned: a.lifetimeTicks >= DESPAWN_TICKS };
}

export interface PickupQuery {
  playerId: string;
  playerIsCreative: boolean;
  inventoryFull: boolean;
}

export function canPickup(a: Arrow, q: PickupQuery): boolean {
  if (!a.inGround) return false;
  if (a.pickupState === 'denied') return false;
  if (a.pickupState === 'creative_only' && !q.playerIsCreative) return false;
  if (q.inventoryFull) return false;
  return true;
}
