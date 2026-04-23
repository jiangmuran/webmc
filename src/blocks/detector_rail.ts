export interface Ctx {
  cartAbove: boolean;
}

export const POWERED_SIGNAL = 15;

export function redstoneOutput(c: Ctx): number {
  return c.cartAbove ? POWERED_SIGNAL : 0;
}

export function powersRailsBelow(c: Ctx): boolean {
  return c.cartAbove;
}
