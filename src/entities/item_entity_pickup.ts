export interface Item {
  age: number;
  pickupDelayTicks: number;
  bobbingOffset: number;
}

export const DESPAWN_TICKS = 6000;
export const DEFAULT_PICKUP_DELAY = 10;

export function canPickUp(i: Item, playerIntersects: boolean): boolean {
  return i.pickupDelayTicks <= 0 && playerIntersects;
}

export function isDespawning(i: Item): boolean {
  return i.age >= DESPAWN_TICKS;
}

export function bobY(tickCount: number): number {
  return Math.sin(tickCount * 0.1) * 0.1;
}
