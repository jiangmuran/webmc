export type Dir = 'north' | 'south' | 'east' | 'west';

export interface TrapdoorCtx {
  facing: Dir;
  half: 'top' | 'bottom';
  open: boolean;
  powered: boolean;
}

export function blocksMovementWhenClosed(c: TrapdoorCtx): boolean {
  return !c.open;
}

export function isClimbable(c: TrapdoorCtx): boolean {
  return c.open;
}

export function opensFromRedstone(c: TrapdoorCtx): boolean {
  return c.powered;
}

export function attachedFace(c: TrapdoorCtx): 'ceiling' | 'floor' {
  return c.half === 'top' ? 'ceiling' : 'floor';
}
