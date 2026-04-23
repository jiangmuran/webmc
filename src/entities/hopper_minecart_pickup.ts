// Hopper minecart picks up item entities above its rail and deposits
// into any inventory below.

export interface MinecartInv {
  slots: (string | null)[];
  maxSlots: number;
}

export function makeCart(): MinecartInv {
  return { slots: [null, null, null, null, null], maxSlots: 5 };
}

export function tryAbsorbItem(cart: MinecartInv, itemId: string): boolean {
  for (let i = 0; i < cart.maxSlots; i++) {
    if (cart.slots[i] === null) {
      cart.slots[i] = itemId;
      return true;
    }
  }
  return false;
}

export const ITEM_PICKUP_RADIUS = 1.5;

export function depositInto(cart: MinecartInv, target: MinecartInv): number {
  let moved = 0;
  for (let i = 0; i < cart.slots.length; i++) {
    const item = cart.slots[i];
    if (!item) continue;
    for (let j = 0; j < target.maxSlots; j++) {
      if (target.slots[j] === null) {
        target.slots[j] = item;
        cart.slots[i] = null;
        moved++;
        break;
      }
    }
  }
  return moved;
}
