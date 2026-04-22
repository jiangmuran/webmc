// Double chest: two adjacent chests facing the same direction merge
// into one 54-slot inventory. Breaking one side splits it back.

export type ChestHalf = 'single' | 'left' | 'right';

export interface ChestBlock {
  facing: 'north' | 'south' | 'east' | 'west';
  half: ChestHalf;
}

export function canPairWith(a: ChestBlock, b: ChestBlock | null): boolean {
  if (!b) return false;
  if (a.facing !== b.facing) return false;
  return a.half === 'single' && b.half === 'single';
}

export function inventorySize(half: ChestHalf): number {
  return half === 'single' ? 27 : 54;
}

export function blockedByOcelotOnTop(hasOcelotAbove: boolean): boolean {
  return hasOcelotAbove;
}

export function needsFreeSpaceAbove(): boolean {
  return true;
}
