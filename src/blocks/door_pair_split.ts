export type Half = 'upper' | 'lower';
export type Dir = 'north' | 'south' | 'east' | 'west';

export interface Door {
  half: Half;
  facing: Dir;
  hinge: 'left' | 'right';
  open: boolean;
}

export function breakingOneBreaksPair(): boolean {
  return true;
}

export function opensWithAdjacentDouble(a: Door, b: Door): boolean {
  return a.facing === b.facing && a.hinge !== b.hinge;
}

export function iconRendersAsOpen(d: Door): boolean {
  return d.open;
}
