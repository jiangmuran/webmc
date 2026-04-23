export interface TrapdoorCtx {
  powered: boolean;
  rightClicked: boolean;
}

export function isOpen(c: TrapdoorCtx): boolean {
  return c.powered;
}

export function manualInteractionIgnored(c: TrapdoorCtx): boolean {
  return c.rightClicked && !c.powered;
}
