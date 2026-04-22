// Bubble column. Magma under water pulls entities down; soul sand under
// water pushes entities up. Vertical column extends above until the water
// ends.

export type ColumnKind = 'up' | 'down';

export interface BubbleColumnLookup {
  isWater(x: number, y: number, z: number): boolean;
  isMagma(x: number, y: number, z: number): boolean;
  isSoulSand(x: number, y: number, z: number): boolean;
}

// Returns the bubble column kind at (x, y, z) if water AND a magma/soul
// sand source exists at the water column's bottom.
export function bubbleColumnAt(
  x: number,
  y: number,
  z: number,
  lookup: BubbleColumnLookup,
): ColumnKind | null {
  if (!lookup.isWater(x, y, z)) return null;
  // Walk down to find a magma or soul sand "source".
  let depth = 0;
  for (let yy = y - 1; yy >= y - 64; yy--) {
    depth++;
    if (lookup.isMagma(x, yy, z)) return 'down';
    if (lookup.isSoulSand(x, yy, z)) return 'up';
    if (!lookup.isWater(x, yy, z)) return null;
    if (depth > 64) return null;
  }
  return null;
}

// Velocity applied per second to an entity inside a bubble column.
export function columnVelocity(kind: ColumnKind): { x: number; y: number; z: number } {
  const vy = kind === 'up' ? 3 : -3;
  return { x: 0, y: vy, z: 0 };
}
