export const ITEM_DESPAWN_TICKS = 20 * 60 * 5;
export const ITEM_PICKUP_DELAY_TICKS = 10;

export interface ItemEntity {
  id: string;
  count: number;
  ageTicks: number;
  pickupDelay: number;
  canBePickedUpBy?: string;
}

export function canPickUp(e: ItemEntity, playerId: string): boolean {
  if (e.pickupDelay > 0) return false;
  if (e.canBePickedUpBy !== undefined && e.canBePickedUpBy !== playerId) return false;
  return true;
}

export function tick(e: ItemEntity): ItemEntity {
  return {
    ...e,
    ageTicks: e.ageTicks + 1,
    pickupDelay: Math.max(0, e.pickupDelay - 1),
  };
}

export function shouldDespawn(e: ItemEntity): boolean {
  return e.ageTicks >= ITEM_DESPAWN_TICKS;
}

export function mergeWith(a: ItemEntity, b: ItemEntity, maxStack: number): ItemEntity | undefined {
  if (a.id !== b.id) return undefined;
  const total = a.count + b.count;
  if (total > maxStack) return undefined;
  return {
    ...a,
    count: total,
    ageTicks: Math.min(a.ageTicks, b.ageTicks),
  };
}
