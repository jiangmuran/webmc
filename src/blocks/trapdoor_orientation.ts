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

// Wiki (minecraft.wiki/w/Trapdoor): "If a trapdoor is open and a
// ladder is placed below it, the ladder is treated as a continuous
// ladder block." An open trapdoor on its own is NOT a climbable
// surface — without a ladder below, it's just a passable block.
// Old `isClimbable(c) → c.open` declared every open trapdoor
// climbable, ignoring the ladder-below requirement. Sibling
// trapdoor_open.ts has the correct two-arg signature; this module
// now matches via an optional below context.
export function isClimbable(c: TrapdoorCtx, below: 'ladder' | 'other' = 'other'): boolean {
  return c.open && below === 'ladder';
}

export function opensFromRedstone(c: TrapdoorCtx): boolean {
  return c.powered;
}

export function attachedFace(c: TrapdoorCtx): 'ceiling' | 'floor' {
  return c.half === 'top' ? 'ceiling' : 'floor';
}
