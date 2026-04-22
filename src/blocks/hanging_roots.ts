// Hanging roots. Decorative; drops itself with shears, nothing otherwise.
// Attaches to bottom of rooted dirt or azalea.

export interface HangingRootCtx {
  attachedTo: 'rooted_dirt' | 'azalea' | 'other';
  supportExists: boolean;
}

export function canStay(c: HangingRootCtx): boolean {
  if (!c.supportExists) return false;
  return c.attachedTo === 'rooted_dirt' || c.attachedTo === 'azalea';
}

export function harvestDrops(withShears: boolean): string[] {
  return withShears ? ['hanging_roots'] : [];
}

export function waterloggable(): boolean {
  return true;
}

export function placeableByBonemealOnRootedDirt(): boolean {
  return true;
}
