export interface Ctx {
  redstonePowered: boolean;
  openedByHand: boolean;
}

export function isOpen(c: Ctx): boolean {
  return c.redstonePowered;
}

export function handOpenIgnored(c: Ctx): boolean {
  return c.openedByHand;
}
