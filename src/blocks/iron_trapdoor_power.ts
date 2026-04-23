export interface Ctx {
  redstonePowered: boolean;
  clicked: boolean;
}

export function isOpen(c: Ctx): boolean {
  return c.redstonePowered;
}

export function manualOpenBlocked(c: Ctx): boolean {
  return c.clicked && !c.redstonePowered;
}
