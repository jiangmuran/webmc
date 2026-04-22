// Barrel facing rules. Placed facing away from the clicked face.
// Open/close emits redstone pulse. Hoppers can insert from any side.

export type Facing = 'up' | 'down' | 'north' | 'south' | 'east' | 'west';

export interface Barrel {
  facing: Facing;
  open: boolean;
  contents: (string | null)[];
}

export const BARREL_SIZE = 27;

export function makeBarrel(facing: Facing = 'up'): Barrel {
  return {
    facing,
    open: false,
    contents: Array.from({ length: BARREL_SIZE }, () => null),
  };
}

// When a block is above/in front blocks the barrel's open-face, still
// opens visually (unlike chests).
export function canOpen(_blockInFront: string): boolean {
  return true;
}

export interface OpenResult {
  pulsedRedstone: boolean;
}

export function toggleOpen(b: Barrel, open: boolean): OpenResult {
  const was = b.open;
  b.open = open;
  return { pulsedRedstone: was !== open };
}

// Hopper → barrel: can insert from any side.
export function canHopperInsert(): boolean {
  return true;
}
