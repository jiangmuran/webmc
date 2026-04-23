export type CartKind = 'tnt' | 'hopper' | 'minecart' | 'chest' | 'furnace' | 'command';

export interface Ctx {
  powered: boolean;
  cart: CartKind;
}

export function primesTnt(c: Ctx): boolean {
  return c.powered && c.cart === 'tnt';
}

export function ejectsRider(c: Ctx): boolean {
  return c.powered && c.cart === 'minecart';
}

export function togglesHopperPickup(c: Ctx): boolean {
  return c.powered && c.cart === 'hopper';
}

export function firesCommandBlock(c: Ctx): boolean {
  return c.powered && c.cart === 'command';
}
