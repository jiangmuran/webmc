// Abandoned mineshaft corridors with rails, cobwebs, chest carts.

export interface MineshaftCtx {
  corridorLength: number;
  hasCobweb: boolean;
  hasRails: boolean;
  hasChestCart: boolean;
  torchSpacing: number;
}

export function defaultCorridor(): MineshaftCtx {
  return {
    corridorLength: 8,
    hasCobweb: true,
    hasRails: true,
    hasChestCart: false,
    torchSpacing: 4,
  };
}

export const CHEST_CART_CHANCE = 0.05;

export function rollChestCart(rand: () => number): boolean {
  return rand() < CHEST_CART_CHANCE;
}

export function cobwebDensity(length: number, rand: () => number): number {
  // ~2% cobweb per block of corridor
  let count = 0;
  for (let i = 0; i < length; i++) if (rand() < 0.02) count++;
  return count;
}

export function railKind(isPowered: boolean): 'rail' | 'powered_rail' {
  return isPowered ? 'powered_rail' : 'rail';
}
